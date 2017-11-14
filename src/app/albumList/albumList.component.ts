import {Component, Inject} from '@angular/core';
import {PatientService} from '../core/patient.service';
import {AlertController, MenuController} from 'ionic-angular';
import {Album, Patient, Story} from '../../shared/types';
import {AlbumService} from '../core/album.service';
import {Observable} from 'rxjs/Rx';
import {MixpanelService} from '../core/mixpanel.service';

import {StoryListComponent} from '../storyList/storyList.component';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {EnvironmentToken, Environment} from '../environment';
import _sortBy from 'lodash/sortBy';

@Component({
  selector: 'prisma-album-list',
  template: `
    <ion-header no-border no-shadow></ion-header>
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
            <prisma-album-story
              [getBackground]="getBackground"
              [album]="album"
              [story]="album.stories[album.stories.length-1]"
              [showDetails]="showDetails"
              [emptyAlbum]="env.emptyAlbum"
              [isAlbum]="true">
            </prisma-album-story>
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
export class AlbumListComponent {
  albums: Observable<Album[]>;
  currentPatient: Patient;

  constructor(
    @Inject(EnvironmentToken) private env: Environment,
    private patientService: PatientService,
    private menu: MenuController,
    private albumService: AlbumService,
    private alertCtrl: AlertController,
    private mixpanel: MixpanelService,
    private navCtrl: NavController
  ) {
    this.getBackground = this.getBackground.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  ionViewWillEnter(): void {
    this.menu.enable(true);
    this.currentPatient = this.patientService.getCurrentPatient();
    this.albums = this.sortAlbumArrayByOwnerAndTitle(
      this.albumService.getAlbums(this.currentPatient.patient_id)
    );
  }

  sortAlbumArrayByOwnerAndTitle(
    albums: Observable<Album[] | Error>
  ): Observable<Album[]> {
    return albums.map((albumArray: Album[]) => {
      return _sortBy<Album>(albumArray, [
        item => item.patientId,
        item => item.title.toLowerCase()
      ]);
    });
  }

  ionViewWillLeave(): void {
    this.menu.enable(false);
  }

  showDetails(album: Album) {
    this.navCtrl.push(StoryListComponent, {
      album
    });
  }

  getBackground(story: Story) {
    return this.albumService.getBackground(story);
  }

  addAlbum(): void {
    const albumFailedAlert = this.alertCtrl.create({
      title: 'Fout bij het maken van het album',
      subTitle:
        'Onze excuses, het album kon niet aangemaakt worden. Er is iets fout met Prisma.\nProbeer later nog eens opnieuw!',
      buttons: ['Ok']
    });

    const text1 = 'Voeg album toe';
    const text2 = 'Annuleer';
    const text3 = 'Voeg toe';

    this.alertCtrl
      .create({
        title: text1,
        message: 'Hoe wil je het album noemen?',
        inputs: [
          {
            name: 'title',
            placeholder: 'bv. Kajakclub'
          }
        ],
        buttons: [
          {
            text: text2
          },
          {
            text: text3,
            handler: data => {
              this.albumService
                .addAlbum(this.currentPatient.patient_id, data.title)
                .subscribe(
                  () => {
                    this.mixpanel.track('AlbumsComponent::add album success', {
                      patient_id: this.currentPatient.patient_id,
                      title: data.title
                    });

                    this.albums = this.sortAlbumArrayByOwnerAndTitle(
                      this.albumService.getAlbums(
                        this.currentPatient.patient_id
                      )
                    );
                  },
                  () => {
                    this.mixpanel.track('AlbumsComponent::add album error', {
                      patient_id: this.currentPatient.patient_id,
                      title: data.title
                    });

                    albumFailedAlert.present();
                  }
                );
            }
          }
        ]
      })
      .present();
  }
}
