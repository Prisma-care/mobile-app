import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {Subject, Observable} from 'rxjs/Rx';
import {takeUntil} from 'rxjs/operators';
import {Story, Album} from '../../../shared/types';

type showDetails = (album: Album, story: Story) => void;
type getBackground = (story: Story) => Observable<string | Error>;

@Component({
  selector: 'prisma-album-story',
  template: `
    <div *ngIf="imageLoaded"
      class="album-thumb test"
      (click)="showDetails(album, story)">
      <img id="album-img" [src]="backgroundImage">
      <div *ngIf="isAlbum">
          <div class="tile-overlay-gradient"></div>
          <div *ngIf="album.hasNew" class="has-new-item">NIEUW</div>
          <h3 class="hist-title">{{album.title || '?'}}</h3>
      </div>
      <div *ngIf="!isAlbum && story.source">
          <div class="boxPlay">
            <div *ngIf="typeYoutube(story)" class="youtube-icon movie-indicator"></div>
          </div>
          <ion-icon *ngIf="story.favorited" class="star tile-star" name="star"
            [class.favorited]="isFavorited"></ion-icon>
          <h3 *ngIf="typeYoutube(story)">{{story.description}}</h3>
      </div>
      <!-- If no story source -->
      <div *ngIf="!isAlbum && !story.source">
          <div class="tile-overlay-gradient"></div>
          <div *ngIf="album.hasNew" class="has-new-item">NIEUW</div>
          <div class="text-story-container">
            <span class="text-story">{{story.description || ''}}</span>
          </div>
      </div>
    </div>
    <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
    </div>
  `
})
export class AlbumOrStoryComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  backgroundImage: SafeStyle;
  backgroundColor: string;
  imageLoaded = false;

  @Input() album: Album;
  @Input() story: Story;
  @Input() getBackground: getBackground;
  @Input() showDetails: showDetails;
  @Input() emptyAlbum: string;
  @Input() isAlbum: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.setBackgroundImage(this.story);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setBackgroundImage(story: Story) {
    if (story) {
      this.getBackground(story)
        .pipe(takeUntil(this.destroy$))
        .subscribe((imageUrl: string) => {
          this.story = {
            ...this.story,
            backgroundImage: imageUrl
          };
          this.backgroundImage = this.sanitizer.bypassSecurityTrustUrl(
            imageUrl
          );
          this.imageLoaded = true;
        });
    } else {
      this.backgroundImage = this.emptyAlbum;
      this.imageLoaded = true;
    }
  }

  typeYoutube(story: Story): boolean {
    return story.type === 'youtube';
  }
}
