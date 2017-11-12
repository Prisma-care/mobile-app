import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {Subject, Observable} from 'rxjs/Rx';
import {takeUntil} from 'rxjs/operators';
import {UserStory} from '../../../dto/user-story';
import {Album} from '../../../dto/album';

type showDetails = (album: Album, story: UserStory) => void;
type getBackground = (story: UserStory) => Observable<string | Error>;

@Component({
  selector: 'prisma-album-story',
  template: `
    <div *ngIf="imageLoaded"
      class="album-thumb"
      (click)="showDetails(album, story)">
      <img class="album-thumb" [src]="backgroundImage">
      <div *ngIf="isAlbum">
          <div class="tile-overlay-gradient"></div>
          <div *ngIf="album.hasNew" class="has-new-item">NIEUW</div>
          <h3 class="hist-title">{{album.title || '?'}}</h3>
      </div>
      <div *ngIf="!isAlbum">
          <div class="boxPlay">
            <div *ngIf="typeYoutube(story)" class="youtube-icon movie-indicator"></div>
          </div>
          <ion-icon *ngIf="story.favorited" class="star" name="star"
            [class.favorited]="isFavorited"></ion-icon>
          <h3 *ngIf="typeYoutube(story)">{{story.description}}</h3>
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
  @Input() story: UserStory;
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

  setBackgroundImage(story: UserStory) {
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

  typeYoutube(story: UserStory): boolean {
    return story.type === 'youtube';
  }
}
