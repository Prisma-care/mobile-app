import {Component, OnDestroy, OnInit} from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {NavParams} from "ionic-angular";
import {Album} from "../../dto/album";
import {AlbumService} from "../core/album.service";
import {PatientService} from "../core/patient.service";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";

@Component({
  selector: 'prisma-storyList-page',
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
            <prisma-story [story]="story" [album]="album"></prisma-story>
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

export class StoryListPage implements OnInit, OnDestroy {

  album: Album;
  stories: UserStory[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private navParams: NavParams,
              private albumService: AlbumService,
              private patientService: PatientService) {
  }

  ngOnInit(): void {
    this.album = this.navParams.get("album") as Album;
    this.stories = this.orderByFavorited();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ionViewDidEnter(): void {
    this.albumService.getAlbum(this.patientService.getCurrentPatient().patient_id, this.album.id)
      .takeUntil(this.destroy$)
      .subscribe((album: Album) => {
        this.album = album as Album;
        this.stories = this.orderByFavorited();
      })
  }

  orderByFavorited() {
    return this.album.stories.reduce((acc, it) => {
      //TODO quickFix for backend not sending the type
      const quickFixedItem = {...it, type : it.source.includes('youtu') ? 'youtube' : null};
      return quickFixedItem.favorited ? [quickFixedItem, ...acc] : [...acc, quickFixedItem]
    }, []);
  }
}
