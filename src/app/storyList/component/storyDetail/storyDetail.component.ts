import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Album, Story, Constant} from '../../../../shared/types';
import {
  NavController,
  NavParams,
  PopoverController,
  ViewController,
  ToastController
} from 'ionic-angular';

import {MixpanelService} from '../../../core/mixpanel.service';
import {NativeTransitionOptions} from '@ionic-native/native-page-transitions';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {StoryOptionsComponent} from './component/storyOptions.component';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player';
import {StoryService} from '../../../core/story.service';
import {PatientService} from '../../../core/patient.service';
import {Subject, pipe} from 'rxjs/Rx';
import {takeUntil} from 'rxjs/operators';
import {ConstantToken} from '../../../di';
import {Content} from 'ionic-angular/navigation/nav-interfaces';
import {CreateOrUpdateStoryComponent} from '../createOrUpdateStory/createOrUpdateStory.component';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'prisma-story-detail',
  templateUrl: `./storyDetail.component.html`
})
export class StoryDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: Content;

  destroy$: Subject<boolean> = new Subject<boolean>();
  album: Album;
  story: Story;
  backgroundImage: SafeUrl;
  source: SafeUrl;
  takenUntilPipe = pipe(takeUntil(this.destroy$));
  showControls = true;
  showDescription = false;
  keyf: (() => void);

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private navParams: NavParams,
    private mixpanel: MixpanelService,
    private sanitizer: DomSanitizer,
    private popoverCtrl: PopoverController,
    private youtube: YoutubeVideoPlayer,
    private storyService: StoryService,
    private patientService: PatientService,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    public toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.mixpanel.track('StoryDetailsPage::view', {
      story: this.story
    });
    this.album = this.navParams.get('album') as Album;
    this.story = this.navParams.get('story') as Story;
    this.backgroundImage = this.sanitizer.bypassSecurityTrustUrl(
      this.story.backgroundImage
    );
    if (this.story.type === 'youtube') {
      this.source = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.story.source
      );
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keyup', this.keyEvent.bind(this));
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ionViewWillEnter() {
    this.content.resize();
  }

  ionViewDidEnter() {
    this.keyf = this.keyEvent.bind(this);
    document.addEventListener('keyup', this.keyf);
  }

  ionViewWillLeave() {
    document.removeEventListener('keyup', this.keyf);
  }

  keyEvent(e) {
    if (e.keyCode === 37) {
      this.previous();
    } else if (e.keyCode === 39) {
      this.next();
    }
  }

  swipeEvent(e) {
    if (this.album.stories.length > 1) {
      const options: NativeTransitionOptions = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150
      };
      // swipes left
      if (e.direction === 4) {
        options.direction = 'right';
        this.previous();
      }

      // swipes right
      if (e.direction === 2) {
        options.direction = 'left';
        this.next();
      }
    }
  }

  next(): void {
    const nextStory = this.album.stories[
      (this.album.stories.findIndex(story => this.story.id === story.id) + 1) %
        this.album.stories.length
    ];
    this.storyService
      .getBackground(nextStory)
      .let(this.takenUntilPipe)
      .subscribe(imageUrl => {
        this.navCtrl.push(StoryDetailsComponent, {
          album: this.album,
          story: {
            ...nextStory,
            backgroundImage: imageUrl
          }
        });
        this.navCtrl.remove(this.viewCtrl.index);
      });
  }

  previous(): void {
    const index =
      this.album.stories.findIndex(story => this.story.id === story.id) === 0
        ? this.album.stories.length - 1
        : this.album.stories.findIndex(story => this.story.id === story.id) - 1;
    const previousStory = this.album.stories[index];
    this.storyService
      .getBackground(previousStory)
      .let(this.takenUntilPipe)
      .subscribe(imageUrl => {
        this.navCtrl.push(StoryDetailsComponent, {
          album: this.album,
          story: {
            ...previousStory,
            backgroundImage: imageUrl
          }
        });
        this.navCtrl.remove(this.viewCtrl.index);
      });
  }

  toggleFavorite(): void {
    this.story.favorited = !this.story.favorited;
    this.storyService
      .updateStory(
        this.patientService.getCurrentPatient().patient_id,
        this.story
      )
      .let(this.takenUntilPipe)
      .subscribe();
  }

  toggleControls(): void {
    if (this.showDescription) {
      this.toggleDescription();
    } else {
      this.showControls = !this.showControls;
    }
  }

  toggleDescription(): void {
    this.showDescription = !this.showDescription;
  }

  openYoutubeVideo(url: string) {
    this.youtube.openVideo(this.storyService.getYoutubeId(url));
  }

  getYoutubeUrl(url: string): SafeUrl {
    const resourceUrl = `https://www.youtube.com/embed/${this.storyService.getYoutubeId(
      url
    )}?autoplay=1&rel=0&showinfo=0&disablekb=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
  }

  editDescription(story: Story) {
    this.mixpanel.track('StoryDetailsPage::editDescription', {
      story
    });

    this.navCtrl.push(CreateOrUpdateStoryComponent, {
      album: this.album,
      story,
      method: this.constant.methods.replaceDescription,
      dataUrl: story.backgroundImage
    });
  }

  showMore(event: Event): void {
    const popover = this.popoverCtrl.create(
      StoryOptionsComponent,
      {
        story: this.story
      },
      {cssClass: 'storyDetail-popover'}
    );

    const toast = (message: string) =>
      this.toastCtrl
        .create({
          message,
          duration: 3000,
          position: 'bottom'
        })
        .present();

    popover.onDidDismiss(dismissData => {
      if (dismissData === 'deleteSuccess') {
        toast('Het verhaal is verwijderd.');
        this.navCtrl.pop();
      }
      if (dismissData === 'deleteError') {
        toast('Het verhaal kon niet verwijderd worden.');
      }
    });
    popover.present({
      ev: event
    });
  }
}
