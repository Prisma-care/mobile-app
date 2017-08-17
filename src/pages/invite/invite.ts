import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";
import {TranslatorService} from "../../providers/translator.service";
import {UtilService} from "../../providers/util-service";

@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
})
export class InvitePage extends AuthGuard {

  private loading: boolean = false;

  firstname: string = "";
  lastname: string = "";
  email:string = "";
  patientId: number;
  util: UtilService;

  constructor(public authService: AuthService, public navCtrl: NavController, public translatorService: TranslatorService, public navParams: NavParams, public utilService: UtilService) {
    super(authService, navCtrl, translatorService);
    this.patientId = navParams.get("patientId") as number;
    this.util = utilService;
  }

  canInvite(){
    return this.util.checkEmail(this.email) && !!this.firstname && !!this.lastname;
  }
  invite(){
    if(this.loading)
      return;
    if(!this.canInvite()){

    }
  }
}
