import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {Injectable} from '@angular/core';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {AuthenticationService} from '../../core/authentication.service';
import {RootComponent} from '../../root.component';

@Injectable()
export class UtilService {
  constructor() {}

  getRegistrationAlert(navCtrl, alertCtrl, authService) {
    const alert = alertCtrl.create({
      title: 'Meld je aan',
      subTitle:
        'Meld je aan om deze actie uit te voeren. Zo kunnen we je bewerkingen bijhouden.',
      buttons: [
        {
          text: 'Ga terug',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Meld je aan',
          handler: () => {
            authService.logout();
            navCtrl.setRoot(RootComponent, {isLogging: true});
          }
        }
      ]
    });
    return alert;
  }
}
