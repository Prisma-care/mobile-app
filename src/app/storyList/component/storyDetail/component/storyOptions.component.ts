import {NavParams, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {StoryService} from '../../../../core/story.service';
import {PatientService} from '../../../../core/patient.service';
import {UserService} from '../../../../core/user.service';
import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {AuthenticationService} from '../../../../core/authentication.service';
import {RootComponent} from '../../../../root.component';
import {NavController} from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'prisma-story-options',
  template: `
    <ion-list class="list">
      <ion-item (click)="this.userService.registrationGuard(this.deleteStory.bind(this),
        this.showRegisterPrompt.bind(this, 'een verhaal te verwijderen'))">
        <ion-icon class="trash-icon" name="md-trash"></ion-icon>
        <p class="contenu">Verwijder dit verhaal</p>
      </ion-item>
    </ion-list>
  `
})
export class StoryOptionsComponent {
  navCtrl: NavController = undefined;
  constructor(
    public viewCtrl: ViewController,
    public storyService: StoryService,
    public navParams: NavParams,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {
    this.navCtrl = this.navParams.get('navCtrl');
  }

  deleteStory(): void {
    this.storyService
      .deleteStory(
        this.patientService.getCurrentPatient().patient_id,
        this.navParams.data.story.id
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
