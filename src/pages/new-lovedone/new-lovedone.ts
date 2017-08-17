import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PatientService } from "../../providers/back-end/user.service";
import { AuthService } from "../../providers/auth-service/auth-service";
import { Patient } from "../../dto/patient";
import { AlbumsPage } from "../albums/albums";
import {env} from "../../app/environment";
import { AuthGuard } from "../auth-guard";
import { TranslatorService } from "../../providers/translator.service";


/**
 * Generated class for the NewLovedonePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-lovedone',
  templateUrl: 'new-lovedone.html',
})
export class NewLovedonePage extends AuthGuard {

  private loading: boolean;

  firstname: string = "";
  lastname: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public lovedOnes: PatientService, public authService: AuthService,
    public  alertCtrl: AlertController, translatorService: TranslatorService) {
      super(authService, navCtrl, translatorService);
  }

  canCreateLovedOne(): boolean {
    // TODO: better regex, share with account creation
    return Boolean(this.firstname.trim()) && Boolean(this.lastname.trim());
  }

  start() {
    if (this.loading)
      return;
    this.loading = true;
    this.createLovedOne().then( (patient) => {
        this.authService.setPatient(patient);
        this.navCtrl.setRoot(AlbumsPage).then(res => {this.loading = false;});
      }
    ).catch( () => {
      this.loading = false;
      this.creationError();
      }
    )
  }

  private createLovedOne(): Promise<Patient> {
    return this.lovedOnes.addPatient(this.firstname, this.lastname).toPromise().then(
      (lovedOne) => {
        this.loading = false;
        return lovedOne as Patient;
      }
    ).catch( () => {
        this.creationError();
      }
    );

  }

  private creationError(errorMessage?: string) {
    let alert = this.alertCtrl.create({
      title: this.translatorService.translateInstant("Oei!"),
      subTitle: this.translatorService.translateInstant("Er was een probleem bij het maken van je geliefde. Probeer het nog eens opnieuw."),
      buttons: ['Ok']
    });
    return alert.present();
  }

}
