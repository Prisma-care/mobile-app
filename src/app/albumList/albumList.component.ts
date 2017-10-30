import {Component, Inject} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {PatientService} from "../core/patient.service";
import {MenuController, NavController} from "ionic-angular";
import {Album} from "../../dto/album";
import {AlbumService} from "../core/album.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'prisma-albumList-page',
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
        <h2>Waarover babbelen we vandaag?</h2>
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
          <ion-icon name="camera"></ion-icon>
          <span>Voeg album toe</span>
        </div>
      </div>
    </ion-content>
  `
})

export class AlbumListPage{

  albums: Observable<Album[]>;

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private patientService: PatientService,
              private menu: MenuController,
              private albumService: AlbumService) {
  }


  ionViewWillEnter():void{
    this.menu.enable(true);
    this.albums=this.albumService.getAlbums(this.patientService.getCurrentPatient().patient_id)
  }

  ionViewWillLeave():void{
    this.menu.enable(false);
  }

  addAlbum(){
    //Todo addAlbum
  }

}
