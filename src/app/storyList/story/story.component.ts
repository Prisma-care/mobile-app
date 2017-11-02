import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {UserStory} from "../../../dto/user-story";
import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import {StoryService} from "../../core/story.service";
import {StoryDetailsPage} from "./storyDetail/storyDetail.component";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'prisma-story',
  template:
    `
    <div *ngIf="imageLoaded" 
         class="album-thumb"
         [style]="backgroundImage"
         (click)="showDetails()">
      <ion-icon name="logo-youtube" color="white"
                class="movie-indicator"
                *ngIf="isAVideo"></ion-icon>
      <ion-icon *ngIf="story.favorited" class="star" name="star"
                [class.favorited]="isFavorited"></ion-icon>
    </div>
    <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
    </div>
  `
})

export class StoryComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundImage:SafeStyle;
  imageUrl:string;
  imageLoaded:Boolean=false;
  isAVideo:Boolean=false;

  @Input()
  story;

  @Input()
  album;

  constructor(private storyService: StoryService,
              private navCtrl: NavController,
              private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.isAVideo=this.story.type==='youtube';
    this.setBackgroundImage(this.story);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setBackgroundImage(story: UserStory) {
      this.storyService.getBackground(story)
        .takeUntil(this.destroy$)
        .subscribe((imageUrl:string) => {
          this.story.backgroundImage = imageUrl;
          this.backgroundImage = this.sanitizer
            .bypassSecurityTrustStyle(`background-image: url(${imageUrl})`);
          this.imageLoaded = true;
        });
  }

  showDetails() {
    this.navCtrl.push(StoryDetailsPage, {
      "album": this.album,
      "story": this.story
    });
  }
}
