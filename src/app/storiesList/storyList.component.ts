import {Component, OnInit} from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {NavParams} from "ionic-angular";
import {Album} from "../../dto/album";

@Component({
  selector: 'prisma-storyList-page',
  styles: [
      `      
      prisma-question {
        height: 30%;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 90000;
      }

      ion-title {
        float: left;
      }

      .grid {
        padding: 0;
      }

      .col, [col-6] {
        padding: 0;
      }

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
    `
  ],
  template:
      `
    <ion-header>
      <ion-navbar>
        <ion-title>{{album.title}}</ion-title>
        <ion-buttons end>
          <button ion-button icon-only (click)="openActionSheet()">
            <ion-icon name="camera" color="white"></ion-icon>
          </button>
        </ion-buttons>

      </ion-navbar>
    </ion-header>

      <ion-content no-bounce>
        <ion-grid>
          <ion-row>
            <ion-col col-6 col-md-4 *ngFor="let story of stories">
              <prisma-story [story]="story"></prisma-story>
            </ion-col>
          </ion-row>
        </ion-grid>
        <div (click)="openActionSheet()" class="add-new-container">
          <div class="add-new">
            <ion-icon name="camera"></ion-icon>
            <span>'Voeg verhaal toe'</span>
          </div>
        </div>
        <!--<prisma-question [query]="album.title"></prisma-question>-->
      </ion-content>

  `
})

export class StoryListPage implements OnInit {

  album:Album;
  stories:UserStory[];

  constructor(private navParams: NavParams) {

  }

  ngOnInit(): void {
    this.album = this.navParams.get("album") as Album;
    this.orderByFavorited();
  }

  orderByFavorited() {
    const favorites= this.album.stories.filter((stories:UserStory)=>stories.favorited);
    const notFavorites= this.album.stories.filter((stories:UserStory)=>!stories.favorited);
    this.stories = favorites.concat(notFavorites);
  }
}
