import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {AlbumService} from '../../core/album.service';
import {PatientService} from '../../core/patient.service';
import {IfFullscreenDirective} from '../../shared/directive/ifFullscreen.directive';
import {ToggleFullscreenDirective} from '../../shared/directive/toggleFullscreen.directive';
import {IfPlatformDirective} from '../../shared/directive/ifPlatform.directive';
import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {AuthenticationService} from '../../core/authentication.service';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {RootComponent} from '../../root.component';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'prisma-story-list-options',
  template: `
    <ion-list class="list">
      <ion-item padding
      (click)="this.userService.registrationGuard(this.actionSheet.bind(this),
      this.showRegisterPrompt.bind(this, 'een verhaal toe te voegen'))">
        <ion-icon class="bar-icon" name="md-add"></ion-icon>
        <p class="contenu">Voeg verhaal toe</p>
      </ion-item>
      <ion-item padding
        (click)="this.userService.registrationGuard(this.deleteAlbum.bind(this),
        this.showRegisterPrompt.bind(this, 'een album te verwijderen'))">
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
    private patientService: PatientService,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private userService: UserService
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
