import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {AlbumService} from '../../core/album.service';
import {PatientService} from '../../core/patient.service';

@Component({
  selector: 'prisma-story-list-options',
  template: `
    <ion-list class="list">
      <ion-item padding (click)="actionSheet()">
        <ion-icon class="bar-icon" name="md-add"></ion-icon>
        <p class="contenu">Voeg verhaal toe</p>
      </ion-item>
      <ion-item padding (click)="deleteAlbum()">
        <ion-icon class="trash-icon" name="md-trash"></ion-icon>
        <p class="contenu">Verwijder album</p>
      </ion-item>
    </ion-list>
  `
})
export class StoryListOptionsComponent {
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private albumService: AlbumService,
    private patientService: PatientService
  ) {}

  actionSheet() {
    this.navParams.get('actionSheet')();
    this.viewCtrl.dismiss();
  }

  deleteAlbum(): void {
    this.albumService
      .deleteAlbum(
        this.patientService.getCurrentPatient().patient_id,
        this.navParams.get('album').id
      )
      .subscribe(
        () => {
          this.viewCtrl.dismiss('deleteSuccess');
        },
        () => {
          this.viewCtrl.dismiss('deleteError');
        }
      );
  }
}
