import {Component, Inject, OnInit} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {UserService} from "../core/user.service";
import {PatientService} from "../core/patient.service";
import {MenuController} from "ionic-angular";
import {User} from "../../dto/user";
import {Album} from "../../dto/album";
import {Patient} from "../../dto/patient";
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
            <prisma-album-page [album]="album"></prisma-album-page>
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

export class AlbumListPage implements OnInit {

  albums: Observable<Album[]>;

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private userService: UserService,
              private patientService: PatientService,
              private menu: MenuController,
              private albumService: AlbumService) {
  }


  ngOnInit(): void {
    this.menu.enable(true);
  }

  ionViewWillEnter():void{
    this.albums=this.albumService.getAlbums(this.patientService.getCurrentPatient().patient_id)
  }

  addAlbum(){
    //Todo addAlbum
  }

}
