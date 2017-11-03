import {Component, Inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {ActionSheetController, NavController, NavParams} from "ionic-angular";
import {Album} from "../../dto/album";
import {AlbumService} from "../core/album.service";
import {PatientService} from "../core/patient.service";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import {Environment, EnvironmentToken} from "../environment";
import {NewStoryPage} from "../../pages/new-story/new-story";
import {UtilService} from "../../providers/util-service";
import { Content } from "ionic-angular/navigation/nav-interfaces";
import { StoryListOptionsComponent } from "./component/storyListOptions.component";
import { PopoverController } from "ionic-angular/components/popover/popover-controller";
import { ToastController } from "ionic-angular/components/toast/toast-controller";

@Component({
  selector: 'prisma-story-list-page',
  template:
      `
    <ion-header>
      <ion-navbar>
        <ion-title>{{album.title}}</ion-title>
        <ion-buttons end>
          <button ion-button icon-only (click)="showMore($event)">
            <ion-icon name="more"></ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content #content no-bounce>
      <ion-grid>
        <ion-row>
          <ion-col col-6 col-md-4 *ngFor="let story of stories">
            <prisma-story [story]="story" [album]="album"></prisma-story>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div (click)="openActionSheet()" class="add-new-container">
        <div class="add-new">
          <ion-icon class="add-icon" name="md-add"></ion-icon>
          <span>Voeg verhaal toe</span>
        </div>
      </div>
      <prisma-question [query]="album.title"></prisma-question>
    </ion-content>
  `
})

export class StoryListPage implements OnInit, OnDestroy {

  @ViewChild('content') content: Content;

  album: Album;
  stories: UserStory[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private navParams: NavParams,
              private albumService: AlbumService,
              private patientService: PatientService,
              private navCtrl: NavController,
              private actionsheetCtrl: ActionSheetController,
              private utilService:UtilService,
              private popoverCtrl: PopoverController,
              private toastCtrl: ToastController) {
  }

  ngOnInit(): void {
    this.album = this.navParams.get("album") as Album;
    this.openActionSheet = this.openActionSheet.bind(this)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ionViewWillEnter(): void {
    this.albumService.getAlbum(this.patientService.getCurrentPatient().patient_id, this.album.id)
      .takeUntil(this.destroy$)
      .subscribe((album: Album) => {
        this.album = album as Album;
        this.stories = this.orderByFavorited();
      })
    this.content.resize();
  }

  orderByFavorited() {
    return this.album.stories.reduce((acc, it) => {
      //TODO quickFix for backend not sending the type
      const quickFixedItem = {...it, type : it.source.includes('youtu') ? 'youtube' : null};
      return quickFixedItem.favorited ? [quickFixedItem, ...acc] : [...acc, quickFixedItem]
    }, []);
  }

  openActionSheet() {
    let text1: string = 'Tekst schrijven';
    let text2: string = 'Maak foto';
    let text3: string = 'Kies foto van camerarol';
    let text4: string = 'Kies video van Youtube';
    let text5: string = 'Annuleer';

    let actionSheet = this.actionsheetCtrl.create({
        title: 'Voeg verhaal toe',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: text2,
            role: 'destructive',
            icon: 'camera',
            cssClass: 'general',
            handler: () => {
              let pictureAttempt: Promise<any> = this.utilService.takeAPicture();

              pictureAttempt.then(
                (dataUrl) => {
                  if (dataUrl)
                    this.navCtrl.push(NewStoryPage,
                      {
                        "dataUrl": dataUrl,
                        "album": this.album,
                        "method": this.env.methods.addNewStory
                      })
                });
            }
          },
          {
            text: text3,
            role: 'destructive',
            icon: 'image',
            handler: () => {
              let fileChooseAttempt: Promise<any> = this.utilService.chooseAFile();

              fileChooseAttempt.then(
                (dataUrl) => {
                  console.log("Data Url : " + dataUrl)
                  if (dataUrl)
                    this.navCtrl.push(NewStoryPage,
                      {
                        "dataUrl": dataUrl,
                        "album": this.album,
                        "method": this.env.methods.addNewStory
                      })
                });
            }
          },
          {
            text: text4,
            role: 'destructive',
            icon: 'play',
            handler: () => {
              this.navCtrl.push(NewStoryPage,
                {
                  "album": this.album,
                  "method":this.env.methods.addYoutubeStory
                });
            }
          },
          {
            text: text5,
            role: 'cancel',
            icon: 'md-arrow-back',
            handler: () => {
              console.log('canceled');
            }
          },
        ]

      })
    ;
    actionSheet.present();
  }

  showMore(event): void {
    const popover = this.popoverCtrl.create(StoryListOptionsComponent, {
      album: this.album,
      actionSheet: this.openActionSheet
    },
    { cssClass: 'storyList-popover'});

    const toast = (message) => this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present();

    popover.onDidDismiss(dismissData => {
      if ((dismissData) === "deleteSuccess") {
        toast('Album was deleted succesfully');
        this.navCtrl.pop();
      }
      if(dismissData === "deleteError"){
        toast('Error deleting the album')
      }
    });
    popover.present({
      ev: event
    });
  }
}
