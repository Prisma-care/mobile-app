import {Component, Input, OnInit} from "@angular/core";
import {NavParams} from "ionic-angular";
import {Album} from "../../../dto/album";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {UserStory} from "../../../dto/user-story";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import {StoryService} from "../../core/story.service";

@Component({
  selector: 'prisma-story',
  styles: [
    `      
      .album-thumb h3 {
        display: inline-block;
        text-align: center;
        margin: auto;
        color: #fff;
        position: absolute;
        bottom: 1em;
        left: 0;
        width: 100%;
      }

      .description-wrapper {
        text-overflow: ellipsis;
        overflow: hidden;
        height: 100%;
        color: colors($ colors, white);
      }

      .story-description {
        margin: 0;
        font-size: map-get($ sizes, 'small');
        color: color($ colors, dark-gray);
      }

      .star {
        font-size: 2.5em;
      }
    `
  ],
  template:
    `
    <div *ngIf="imageLoaded" 
         class="album-thumb"
         [style]="backgroundImage">
      <div class="description-wrapper" *ngIf="!story.source && story.description">
        <p class="story-description">{{story.description}}</p>
      </div>
      <ion-icon name="logo-youtube" color="white"
                class="movie-indicator"
                *ngIf="isAVideo"></ion-icon>
      <ion-icon *ngIf="isFavorited" class="star" name="star"
                [class.favorited]="isFavorited"></ion-icon>
    </div>
    <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
    </div>
  `
})

export class StoryComponent implements OnInit {

  backgroundImage:SafeStyle;
  imageLoaded:Boolean=false;
  isAVideo:Boolean=false;
  isFavorited:Boolean=false;


  @Input()
  story;

  constructor(private storyService: StoryService,
              private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.setBackgroundImage(this.story)
  }

  setBackgroundImage(story: UserStory) {
      Observable.of(story)
        .map(item => {
          this.isFavorited=item.favorited;
          if (item.type !== "youtube") {
            return this.storyService.getImage(item.source)
          } else {
            this.isAVideo = true;
            return Observable.of(this.storyService.getThumb(item.source))
          }
        })
        .switchMap(x => x)
        .subscribe(imageUrl => {
          this.backgroundImage = this.sanitizer
            .bypassSecurityTrustStyle(`background-image: url(${imageUrl})`);
          this.imageLoaded = true;
        })
  }
}
