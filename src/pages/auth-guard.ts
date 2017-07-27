import {AuthService} from "../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";
import {LoginPage} from "./login/login";
import {Injectable} from "@angular/core";


@Injectable()
export class AuthGuard {
  //General injection
  constructor(protected authService: AuthService, protected  navCtrl: NavController) {
  }

  ionViewCanEnter(): boolean {
    console.log("dajdajjda2");
    if (!this.authService.isLoggedIn()) {
      console.log("trying");
      this.navCtrl.setRoot(LoginPage).then(res => {
        this.navCtrl.popToRoot();
        return false;
      });
    } else {
      return true;
    }
  }
}
