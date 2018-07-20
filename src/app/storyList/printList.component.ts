import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgClass} from '@angular/common';
import {Story, Album, Constant} from '../../shared/types';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {AlbumService} from '../core/album.service';
import {PatientService} from '../core/patient.service';
import {Subject, pipe} from 'rxjs/Rx';
import {takeUntil} from 'rxjs/operators';
import {ConstantToken} from '../di';
import {Content} from 'ionic-angular';
import {StoryListOptionsComponent} from './component/storyListOptions.component';
import {PopoverController} from 'ionic-angular/components/popover/popover-controller';
import {ToastController} from 'ionic-angular/components/toast/toast-controller';
import {StoryService} from '../core/story.service';
import {CreateOrUpdateStoryComponent} from './component/createOrUpdateStory/createOrUpdateStory.component';
import {StoryDetailsComponent} from './component/storyDetail/storyDetail.component';
import {TopicPopoverComponent} from './component/topic-popover/topic-popover.component';
import _sortBy from 'lodash/sortBy';
import {Platform} from 'ionic-angular/platform/platform';
import {platform} from 'os';
import {TopicService} from '../core/topic.service';
import {StoryListComponent} from './storyList.component';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'prisma-print-list',
  template: `
    <div class="print-info">
      <h1>Print het album {{album ? album.title : ''}}</h1>
      <p>Druk op Ctrl+P om het printdialoog te openen.
    </div>
    <div class="print-tile" *ngFor="let story of stories">
        <prisma-album-story
            [getBackground]="getBackground"
            [album]="album"
            [story]="story"
            [showDetails]="showDetails"
            [emptyAlbum]="constant.emptyAlbum"
            [isAlbum]="false">
        </prisma-album-story>
        <p class="print-description" *ngIf="story.description"
          >{{story.description | slice:0:200}}{{story.description.length > 200 ? '...' : ''}}</p>
    </div>
    `,
  styles: [
    `
      prisma-print-list > div:not(.print-info) {
        float: left;
        width: 50%;
        padding: 1em 1em 0 0;
      }

      .print-info {
        padding-top: 20%;
        text-align: center;
      }

      @media print {
        .print-info {
          display: none;
        }
        .print-description {
          padding: 0 1em;
        }
      }

      @media screen {
        .print-tile {
          display: none;
         }
      }
      `
  ],
  encapsulation: ViewEncapsulation.None
})
export class PrintListComponent implements OnInit, OnDestroy {
  /*

    TODO: inheritance seems to be broken somehow,
            so this is a copy-paste

    */
  album: Album;
  stories: Story[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  takenUntilPipe = pipe(takeUntil(this.destroy$));
  hasTopics = true;

  // @ViewChild(Content) content: Content;

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private navParams: NavParams,
    private albumService: AlbumService,
    private patientService: PatientService,
    private topicService: TopicService,
    private navCtrl: NavController,
    private actionsheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private storyService: StoryService,
    private plt: Platform
  ) {
    this.getBackground = this.getBackground.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  ngOnInit(): void {
    this.album = this.navParams.get('album');
    this.openActionSheet = this.openActionSheet.bind(this);
    this.hasTopics = this.topicService.hasQuestions(this.album.title);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.albumService
      .getAlbum(
        this.patientService.getCurrentPatient().patient_id,
        this.album.id
      )
      .let(this.takenUntilPipe)
      .subscribe(album => {
        this.album = album as Album;
        this.stories = _sortBy(this.album.stories, [
          item => !item.favorited,
          item => -new Date(item.updatedAt.date).getTime()
        ]);
      });
    // this.content.resize();
  }

  ionViewDidEnter(): void {
    // this.content.scrollToTop();
  }

  getBackground(story: Story) {
    return this.storyService.getBackground(story);
  }

  showDetails(album: Album, story: Story) {
    this.navCtrl.push(StoryDetailsComponent, {
      album,
      story
    });
  }

  showPrint(): void {
    this.navCtrl.push(PrintListComponent, {
      album: this.album
    });
  }

  openTopics(): void {
    const popover = this.popoverCtrl.create(TopicPopoverComponent, {
      topicQuery: this.album.title
    });
    popover.present();
  }

  openActionSheet(): void {
    const text2 = 'Maak foto';
    const text3 = 'Kies foto van camerarol';
    const text4 = 'Kies video van Youtube';
    const text5 = 'Annuleer';

    let btns = [
      {
        text: text4,
        role: 'destructive',
        icon: 'play',
        handler: () => {
          this.navCtrl.push(CreateOrUpdateStoryComponent, {
            album: this.album,
            method: this.constant.methods.addYoutubeStory
          });
        }
      },
      {
        text: text5,
        role: 'cancel',
        icon: 'md-arrow-back',
        handler: () => {}
      }
    ];

    // if on mobile, allow taking a picture (cordova) or camera roll
    if (this.plt.is('cordova')) {
      btns = [
        {
          text: text2,
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.storyService
              .takeAPicture()
              .let(this.takenUntilPipe)
              .subscribe(dataUrl => {
                this.navCtrl.push(CreateOrUpdateStoryComponent, {
                  dataUrl: dataUrl,
                  album: this.album,
                  method: this.constant.methods.addNewStory
                });
              });
          }
        },
        {
          text: text3,
          role: 'destructive',
          icon: 'image',
          handler: () => {
            this.storyService
              .chooseAFile()
              .let(this.takenUntilPipe)
              .subscribe(dataUrl => {
                this.navCtrl.push(CreateOrUpdateStoryComponent, {
                  dataUrl: dataUrl,
                  album: this.album,
                  method: this.constant.methods.addNewStory
                });
              });
          }
        },
        ...btns
      ];
    } else {
      btns = [
        {
          text: 'Upload een foto',
          role: 'destructive',
          icon: 'cloud-upload',
          handler: () => {
            this.navCtrl.push(CreateOrUpdateStoryComponent, {
              album: this.album,
              method: this.constant.methods.addFileStory
            });
          }
        },
        ...btns
      ];
    }

    const actionSheet = this.actionsheetCtrl.create({
      title: 'Voeg verhaal toe',
      cssClass: 'action-sheets-basic-page',
      buttons: btns
    });
    actionSheet.present();
  }

  showMore(event: Event): void {
    const popover = this.popoverCtrl.create(
      StoryListOptionsComponent,
      {
        album: this.album,
        actionSheet: this.openActionSheet,
        navCtrl: this.navCtrl
      },
      {cssClass: 'storyList-popover'}
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
        toast('Het album is verwijderd.');
        this.navCtrl.pop();
      }
      if (dismissData === 'deleteError') {
        toast('Het album kon niet verwijderd worden.');
      }
    });
    popover.present({
      ev: event
    });
  }
}
