import {Component, Inject, Input, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {AlbumService} from "../../core/album.service";
import {UserStory} from "../../../dto/user-story";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/last";
import {StoryListPage} from "../../storiesList/storyList.component";

@Component({
  selector: 'prisma-album',
  styles:
    [
        `
        .grid {
          padding: 0;
        }

        .albums-menu {
          position: absolute;
          top: 0.2em;
          left: 0.2em;
          font-size: 1.7em;
          box-shadow: none;
          -webkit-box-shadow: none;
        }

        .col, [col-6] {
          padding: 0;
        }

        .album-thumb h3 {
          padding: 0 1em;
          display: inline-block;
          text-align: center;
          margin: auto;
          color: #fff;
          position: absolute;
          bottom: 1em;
          left: 0;
          width: 100%;

        }

        .img-loaded + ion-spinner {
          display: none;
        }
      `
    ],
  template:
      `
    <div *ngIf="imageLoaded"
         class="album-thumb"
         [style]="backgroundImage"
         [style.background-color]="backgroundColor"
         (click)="showDetails(album)">
      <div class="tile-overlay-gradient"></div>
      <h3 class="hist-title">{{album.title || '?'}}</h3>
      <ion-icon name="logo-youtube" color="white"
                class="movie-indicator"
                *ngIf="isAVideo"></ion-icon>
    </div>
    <div *ngIf="!imageLoaded" class="album-thumb">
      <ion-spinner item-start name="dots" color="white"></ion-spinner>
    </div>
  `
})

export class AlbumComponent implements OnInit {
  colorCodes: string[] = ["#FAD820", "#FF9F00", "#F35A4B", "#D95DB4", "#637DC8"];
  backgroundImage: SafeStyle;
  backgroundColor: string;
  imageLoaded: boolean = false;
  isAVideo: boolean = false;
  @Input()
  album;

  constructor(private albumService: AlbumService,
              private sanitizer: DomSanitizer,
              private navCtrl: NavController) {
  }


  ngOnInit(): void {
    console.log("album", this.album);
    this.setBackgroundImage(this.album.stories);
  }


  setBackgroundImage(stories: UserStory[]) {
    if (stories.length !== 0) {
      Observable.from(stories)
        .last()
        .map(item => {
          if (item.type !== "youtube") {
            return this.albumService.getImage(item.source)
          } else {
            this.isAVideo = true;
            return Observable.of(this.albumService.getThumb(item.source))
          }
        })
        .switchMap(x => x)
        .subscribe(imageUrl => {
          this.backgroundImage = this.sanitizer
            .bypassSecurityTrustStyle(`background-image: url(${imageUrl})`);
          this.imageLoaded = true;
        })
    } else {
      this.backgroundColor = this.colorCodes[Math.floor(Math.random() * this.colorCodes.length)]
      this.imageLoaded = true;
    }
  }

  showDetails() {
    this.navCtrl.push(StoryListPage, {
      "album": this.album,
    });
  }
}
