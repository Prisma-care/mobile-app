import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {AuthGuard} from "../auth-guard";
import {AuthenticationService} from "../../app/core/authentication.service";
import {TranslatorService} from "../../providers/translator.service";
import {UtilService} from "../../providers/util-service";
import {PatientService} from "../../providers/back-end/user.service";
import {AlbumsPage} from "../albums/albums";
import {MixpanelService} from '../../providers/analytics/mixpanel.service';
import {UserService} from "../../app/core/user.service";

@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage  {

  firstname: string = "";
  lastname: string = "";
  email: string = "";
  patientId: number;
  util: UtilService;
  private loading: boolean = false;

  constructor(public authService: AuthenticationService, public navCtrl: NavController, public translatorService: TranslatorService,
              public alertCtrl: AlertController,private userService: UserService, public navParams: NavParams, public utilService: UtilService,
              private mixpanel: MixpanelService) {
    this.patientId = navParams.get("patientId") as number;
    this.util = utilService;
  }

  canInvite() {
    return this.util.checkEmail(this.email) && !!this.firstname && !!this.lastname;
  }

  invite() {
    this.mixpanel.track('InviteComponent::invite started');

    if (this.loading)
      return;
    this.loading = true;
    if (!this.canInvite()) {
      this.inviteError('Voer een voornaam, naam en email adres in.');
      this.loading = false;
      return;
    }
    const data = {
      inviterId: this.userService.getCurrentUser().id + "",
      lastName: this.lastname,
      firstName: this.firstname,
      email: this.email,
      patientId: this.patientId + ""
    };
    this.userService.inviteUser(data).toPromise().then(res => {
      if (res == true) {

        this.mixpanel.track('InviteComponent::invite success', data);

        this.inviteDone();
        this.navCtrl.setRoot(AlbumsPage).then(res => {
          this.loading = false;
        });
      } else {
        this.mixpanel.track('InviteComponent::invite error', data);
        const error= res.json();
        console.log('error:invitation', error);
        this.inviteError(error.meta  ? error.meta.message.email.join('\n') : '');
        this.loading = false;
      }
    });
  }

  inviteError(errorMessage: string) {
    const errorMsgDefault = `${this.firstname} kon niet uitgenodigd worden.
    ${errorMessage}`;
    let alert = this.alertCtrl.create({
      title: errorMsgDefault,
      buttons: ['Ok']
    });
    alert.present();

  }

  inviteDone() {
    var message = this.firstname + " ontvangt een e-mail met je uitnodiging.";
    this.translatorService.translate([message], (translations) => {
      let alert = this.alertCtrl.create({
        title: message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }
}
