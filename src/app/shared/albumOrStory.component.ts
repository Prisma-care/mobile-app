import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/last";
import {Subject} from "rxjs/Subject";
import { UserStory } from "../../dto/user-story";

@Component({
  selector: 'prisma-album-story',
  template:
      `
    <div *ngIf="template">
      <div *ngIf="imageLoaded"
          class="album-thumb"
          (click)="showDetails(album)">
        <img class="album-thumb" [src]="backgroundImage">
        <div class="tile-overlay-gradient"></div>
        <div *ngIf="album.hasNew" class="has-new-item">NIEUW</div>
        <h3 class="hist-title">{{album.title || '?'}}</h3>
      </div>
      <div *ngIf="!imageLoaded" class="album-thumb">
        <ion-spinner item-start name="dots" color="white"></ion-spinner>
      </div>
    </div>
      
    <div *ngIf="!template">
      <div *ngIf="imageLoaded" 
      class="album-thumb"
      (click)="showDetails(album, story)">
      <img class="album-thumb" [src]="backgroundImage">
      <div class="boxPlay">
        <div *ngIf="story.type==='youtube'" class="youtube-icon movie-indicator"></div>
      </div>
      <ion-icon *ngIf="story.favorited" class="star" name="star"
      [class.favorited]="isFavorited"></ion-icon>
      <h3 *ngIf="story.type==='youtube'">{{story.description}}</h3>
      </div>
      <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
      </div>
    </div>
  `
})

export class AlbumOrStoryComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundImage: SafeStyle;
  backgroundColor: string;
  imageLoaded: boolean = false;
  isAVideo: boolean = false;
  
  @Input()
  album;

  @Input()
  story;

  @Input()
  setBackground;

  @Input()
  showDetails;

  @Input()
  emptyAlbum

  @Input()
  template;


  constructor(private sanitizer: DomSanitizer) {
  }


  ngOnInit(): void {
    this.setBackgroundImage(this.story);

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setBackgroundImage(story: UserStory) {
    if (story) {
      this.setBackground(story)
        .takeUntil(this.destroy$)
        .subscribe(imageUrl => {
          this.story = {
            ...this.story,
            backgroundImage:imageUrl
          }
          this.backgroundImage = this.sanitizer
            .bypassSecurityTrustUrl(imageUrl);
          this.imageLoaded = true;
        });
      this.isAVideo=story.type==='youtube';
    } else {
      this.backgroundImage = this.emptyAlbum;
      this.imageLoaded = true;
    }
  }
}
