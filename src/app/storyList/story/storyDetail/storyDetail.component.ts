import {Component, Inject, OnInit} from "@angular/core";
import {Album} from "../../../../dto/album";
import {UserStory} from "../../../../dto/user-story";
import { NavController, NavParams, PopoverController, ViewController, ToastController} from "ionic-angular";

import {Analytics} from "../../../../providers/analytics";
import {NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {StoryOptionsComponent} from "./storyOption/storyOptions.component";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {StoryService} from "../../../core/story.service";
import {PatientService} from "../../../core/patient.service";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import {NewStoryPage} from "../../../../pages/new-story/new-story";
import {Environment, EnvironmentToken} from "../../../environment";

@Component({
  selector: 'prisma-story-detail',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title class="detail-title">
          {{album.title}}
        </ion-title>
        <ion-buttons end>
          <button ion-button icon-only (click)="showMore($event)">
            <ion-icon name="more"></ion-icon>
          </button>
        </ion-buttons>

      </ion-navbar>
    </ion-header>

    <ion-content no-bounce>
      <div (swipe)="swipeEvent($event)">
          <div class="image-container"
               *ngIf="!isAVideo">
              <img id="{{story.id}}" [src]="backgroundImage"
                   style="width:100%; max-width:100%">
              <ion-icon class="star" name="{{story.favorited ? 'star' : 'star-outline'}}"
                        [class.favorited]="story.favorited" (click)="toggleFavorite()"></ion-icon>
          </div>
          <div class="image-container"
               *ngIf="isAVideo">
            <img id="{{'video-'+story.id}}" [src]="backgroundImage"
                 (click)="openYoutubeVideo(story.source)"
                 style="width:100%; max-width:100%">
            <ion-icon name="logo-youtube" color="white"
                      (click)="openYoutubeVideo(story.source)"
                      style=" position: absolute;display: block;font-size: 50px;top: 35%;left: 35%;"
                      class="movie-indicator"></ion-icon>
            <ion-icon class="star" name="{{story.favorited ? 'star' : 'star-outline'}}"
                      [class.favorited]="story.favorited" (click)="toggleFavorite()"></ion-icon>
          </div>
          <div class="description" color="general" *ngIf="story.description">
            <p class="description-text">{{story.description}}</p>
          </div>

          <div class="row">
            <div class="detail-button">
              <div class="story-action" (click)="editDescription(this.story)">
                <ion-icon name="md-create" color="general"></ion-icon>
                <p>Vul het verhaal aan</p>
              </div>
              <div class="story-action" (click)="replaceOrAddImage()" *ngIf="!story.source">
                <ion-icon name="camera" color="general"></ion-icon>
                <p>Voeg een foto toe</p>
              </div>
            </div>
          </div>
        </div>
    </ion-content>
  `,

})
export class StoryDetailsPage implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  album: Album;
  story: UserStory;
  backgroundImage: SafeUrl;
  isAVideo: Boolean = false;

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private navParams: NavParams,
              private analytics: Analytics,
              private sanitizer: DomSanitizer,
              private popoverCtrl: PopoverController,
              private youtube: YoutubeVideoPlayer,
              private storyService: StoryService,
              private patientService: PatientService,
              private navCtrl: NavController,
              private viewCtrl: ViewController,
              public toastCtrl: ToastController) {
  }

  ngOnInit(): void {
    this.analytics.track('StoryDetailsPage::view', {
      story: this.story,
    });
    this.album = this.navParams.get("album") as Album;
    this.story = this.navParams.get("story") as UserStory;
    this.backgroundImage = this.sanitizer.bypassSecurityTrustUrl(this.story.backgroundImage);
    this.isAVideo = this.story.type === "youtube"
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  swipeEvent(e) {
    if(this.album.stories.length>1) {
      let options: NativeTransitionOptions = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 100,
        androiddelay: 150,
      };
      //swipes left
      if (e.direction == 4) {
        options.direction = 'rigth';
        this.previous();
      }

      //swipes rigth
      if (e.direction == 2) {
        options.direction = 'left';
        this.next();
      }
    }
  }

  next(): void {
    const nextStoryBeforeType = this.album.stories[(this.album.stories.findIndex(story => this.story.id === story.id) + 1) % this.album.stories.length];
    const nextStory = {...nextStoryBeforeType, type : nextStoryBeforeType.source.includes('youtu') ? 'youtube' : null};
    this.storyService.getBackground(nextStory)
      .takeUntil(this.destroy$)
      .subscribe(imageUrl => {
        nextStory.backgroundImage = imageUrl;
        this.navCtrl.push(StoryDetailsPage, {
          "album": this.album,
          "story": nextStory
        });
        this.navCtrl.remove(this.viewCtrl.index)
      })
  }

  previous(): void {
    const index = this.album.stories.findIndex(story => this.story.id === story.id) === 0 ? this.album.stories.length - 1 : this.album.stories.findIndex(story => this.story.id === story.id) - 1;
    const previousStoryBeforeType = this.album.stories[index];
    const previousStory = {...previousStoryBeforeType, type : previousStoryBeforeType.source.includes('youtu') ? 'youtube' : null};
    this.storyService.getBackground(previousStory)
      .takeUntil(this.destroy$)
      .subscribe((imageUrl) => {
        previousStory.backgroundImage=imageUrl;
        this.navCtrl.push(StoryDetailsPage, {
          "album": this.album,
          "story": previousStory
        });
        this.navCtrl.remove(this.viewCtrl.index)
      })
  }

  toggleFavorite(): void {
    this.story.favorited = !this.story.favorited;
    this.storyService.updateStory(+this.patientService.getCurrentPatient().patient_id, this.story)
      .takeUntil(this.destroy$)
      .subscribe()
  }

  openYoutubeVideo(url: string) {
    this.youtube.openVideo(this.storyService.getYoutubeId(url));
  }

  editDescription(story) {

    this.analytics.track('StoryDetailsPage::editDescription', {
      story
    });

    this.navCtrl.push(NewStoryPage, {
      "album": this.album,
      "story": story,
      "method": this.env.methods.replaceDescription
    })
  }

  showMore(event): void {
    const popover = this.popoverCtrl.create(StoryOptionsComponent, {
      story: this.story
    });

    const toast = (message) => this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present();

    popover.onDidDismiss(dismissData => {
      if ((dismissData) === "deleteSuccess") {
        toast('Story was deleted succesfully');
        this.navCtrl.pop();
      }
      if(dismissData === "deleteError"){
        toast('Error deleting the story')
      }
    });
    popover.present({
      ev: event
    });
  }
}
