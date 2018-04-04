import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {AlbumService} from '../../core/album.service';
import {PatientService} from '../../core/patient.service';
import {IfFullscreenDirective} from '../../shared/directive/ifFullscreen.directive';
import {ToggleFullscreenDirective} from '../../shared/directive/toggleFullscreen.directive';
import {IfPlatformDirective} from '../../shared/directive/ifPlatform.directive';

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
      <ion-item padding *prismaIfPlatform='"notCordova"' prismaToggleFullscreen (click)="dismiss()">
        <ion-icon *prismaIfFullscreen="false" class="trash-icon" name="md-expand"></ion-icon>
        <ion-icon *prismaIfFullscreen="true" class="trash-icon" name="md-contract"></ion-icon>
        <p *prismaIfFullscreen="false" class="contenu">Volledig scherm</p>
        <p *prismaIfFullscreen="true" class="contenu">Terug klein scherm</p>
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

  dismiss(): void {
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
