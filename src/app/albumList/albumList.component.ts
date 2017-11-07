import {Component} from "@angular/core";
import {PatientService} from "../core/patient.service";
import {AlertController, MenuController} from "ionic-angular";
import {Album} from "../../dto/album";
import {AlbumService} from "../core/album.service";
import {Observable} from "rxjs/Observable";
import {Analytics} from "../../providers/analytics";
import { Patient } from "../../dto/patient";

@Component({
  selector: 'prisma-album-list-page',
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

        .button {
          left: -0.5em
        }

        .col, [col-6] {
          padding: 0;
        }
      `
    ],
  template:
      `
    <ion-content>
      <div class="page-header">
        <button ion-button menuToggle class="albums-menu">
          <ion-icon color="black" name='menu'></ion-icon>
        </button>
        <h2>Waarover babbelen<br/> we vandaag?</h2>
      </div>
      <ion-grid *ngIf="albums">
        <ion-row>
          <ion-col col-6 col-md-4 *ngFor="let album of albums | async">
            <prisma-album [album]="album"></prisma-album>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div class="add-new-container">
        <div class="add-new" (click)="addAlbum()">
          <ion-icon class="add-icon" name="md-add"></ion-icon>
          <span>Voeg album toe</span>
        </div>
      </div>
    </ion-content>
  `
})

export class AlbumListPage {

  albums: Observable<Album[]>;
  currentPatient: Patient;

  constructor(private patientService: PatientService,
              private menu: MenuController,
              private albumService: AlbumService,
              private alertCtrl: AlertController,
              private analytics: Analytics) {
  }


  ionViewWillEnter(): void {
    this.menu.enable(true);
    this.currentPatient = this.patientService.getCurrentPatient()
    this.albums = this.albumService.getAlbums(this.currentPatient.patient_id) as Observable<Album[]>
  }

  ionViewWillLeave(): void {
    this.menu.enable(false);
  }

  addAlbum(): void {

    let albumFailedAlert = this.alertCtrl.create({
      title: 'Fout bij het maken van het album',
      subTitle: 'Onze excuses, het album kon niet aangemaakt worden. Er is iets fout met Prisma.\nProbeer later nog eens opnieuw!',
      buttons: ['Ok']
    });

    let text1: string = 'Voeg album toe';
    let text2: string = 'Annuleer';
    let text3: string = 'Voeg toe';

    this.alertCtrl.create({
      "title": text1,
      "message": 'Hoe wil je het album noemen?',
      inputs: [
        {
          name: 'title',
          placeholder: 'bv. Kajakclub'
        },
      ],
      buttons: [
        {
          text: text2
        },
        {
          text: text3,
          handler: data => {
            this.albumService.addAlbum(this.currentPatient.patient_id, data.title)
              .subscribe(() => {
                this.analytics.track('AlbumsComponent::add album success', {
                  patient_id: this.currentPatient.patient_id,
                  title: data.title
                });

                this.albums = this.albumService.getAlbums(this.currentPatient.patient_id) as Observable<Album[]>
              }, () => {
                this.analytics.track('AlbumsComponent::add album error', {
                  patient_id: this.currentPatient.patient_id,
                  title: data.title
                });

                albumFailedAlert.present()
              })
          }
        }
      ]
    }).present();
  }
}
