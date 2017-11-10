import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {PatientService} from "../../app/core/patient.service";
import {AuthenticationService} from "../../app/core/authentication.service";
import {Patient} from "../../dto/patient";
import {AlbumsPage} from "../albums/albums";
import {TranslatorService} from "../../providers/translator.service";

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
export class NewLovedonePage  {

  firstname: string = "";
  lastname: string = "";
  private loading: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public lovedOnes: PatientService, public authService: AuthenticationService,
              public  alertCtrl: AlertController, translatorService: TranslatorService) {
  }

  canCreateLovedOne(): boolean {
    // TODO: better regex, share with account creation
    return Boolean(this.firstname.trim()) && Boolean(this.lastname.trim());
  }

  start() {

  }

  private createLovedOne(): Promise<void | Patient> {
    return this.lovedOnes.addPatient(this.firstname, this.lastname).toPromise().then(
      (lovedOne) => {
        this.loading = false;
        return lovedOne as Patient;
      }
    ).catch(() => {
        this.loading = false;
        this.creationError();
      }
    );
  }

  private creationError(errorMessage?: string) {
    let alert = this.alertCtrl.create({
      title: "Oei!",
      subTitle: errorMessage || "Er was een probleem bij het maken van je geliefde. Probeer het nog eens opnieuw.",
      buttons: ['Ok']
    });
    return alert.present();
  }

}
