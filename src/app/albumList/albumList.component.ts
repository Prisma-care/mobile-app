import {Component, Inject} from '@angular/core';
import {PatientService} from '../core/patient.service';
import {AlertController, MenuController} from 'ionic-angular';
import {Album, Patient, Story, Constant} from '../../shared/types';
import {AlbumService} from '../core/album.service';
import {Observable} from 'rxjs/Rx';
import {MixpanelService} from '../core/mixpanel.service';

import {StoryListComponent} from '../storyList/storyList.component';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {ConstantToken} from '../di';
import {ToggleFullscreenDirective} from '../shared/directive/toggleFullscreen.directive';
import _sortBy from 'lodash/sortBy';
import {UtilService} from '../shared/provider/util.service';
import {UserService} from '../core/user.service';
import {AuthenticationComponent} from '../auth/authentication.component';
import {AuthenticationService} from '../core/authentication.service';
import {RootComponent} from '../root.component';

@Component({
  selector: 'prisma-album-list',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Waarover babbelen we?</ion-title>
        <ion-buttons left>
          <button ion-button menuToggle class="albums-menu">
            <ion-icon color="black" name="menu"></ion-icon>
          </button>
        </ion-buttons>
        <ion-buttons right>
          <prisma-fullscreen-button></prisma-fullscreen-button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-grid *ngIf="albums">
        <ion-row>
          <ion-col
            col-6
            col-md-4
            col-lg-3
            *ngFor="let album of (albums | async)"
          >
            <prisma-album-story
              [getBackground]="getBackground"
              [album]="album"
              [story]="album.stories[album.stories.length - 1]"
              [showDetails]="showDetails"
              [emptyAlbum]="constant.emptyAlbum"
              [isAlbum]="true"
            >
            </prisma-album-story>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div
        class="add-new-container"
        (click)="this.userService.registrationGuard(this.addAlbum.bind(this),
          this.showRegisterPrompt.bind(this, 'een album toe te voegen'))"
      >
        <div class="add-new">
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
  enteredFirstTime = false;

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private menu: MenuController,
    private albumService: AlbumService,
    private mixpanel: MixpanelService,
    private navCtrl: NavController,
    private utilService: UtilService,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {
    this.getBackground = this.getBackground.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  getJsonFromUrl(url): any {
    if (!url) {
      url = location.search;
    }
    const query = url.substr(1);
    const result = {};
    query.split('&').forEach(function(part) {
      const item = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  ionViewWillEnter(): void {
    this.menu.enable(true);
    this.patientService.patientExists().subscribe(bool => {
      if (bool && this.patientService.patientExistsSync()) {
        this.currentPatient = this.patientService.getCurrentPatient();
        this.albums = this.sortAlbumArrayByOwnerAndTitle(
          this.albumService.getAlbums(this.currentPatient.patient_id)
        );

        // hack: redirect to specific album if necessary
        const params = this.getJsonFromUrl(window.location.search);
        if (!!params.album && !this.enteredFirstTime) {
          this.albums.subscribe(albums => {
            // the compiler is wrong, album id's are numbers. == for compatibility
            const album = albums.find(a => a.title === params.album);
            if (album) {
              this.navCtrl.push(StoryListComponent, {album});
            }
            this.enteredFirstTime = true;
          });
        }
      }
    });
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

  showRegisterPrompt(intentionText): void {
    const alert = this.alertCtrl.create({
      title: 'Meld je aan',
      subTitle: `Meld je aan om ${intentionText}. Zo kan je je bewerkingen bijhouden.`,
      buttons: [
        {
          text: 'Ga terug'
        },
        {
          text: 'Meld je aan',
          handler: () => {
            this.authService.logout();
            this.navCtrl.setRoot(RootComponent, {isLogging: true});
          }
        }
      ]
    });
    alert.present();
  }
}
