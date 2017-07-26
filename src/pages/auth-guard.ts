import {AuthService} from "../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";
import {LoginPage} from "./login/login";
import {Injectable} from "@angular/core";


@Injectable()
export class AuthGuard {
  //General injection
  constructor(protected authService: AuthService, protected  navCrtlIn?: NavController) {

  }

  ionViewCanEnter(): boolean {
    console.log("dajdajjda");
    if (!this.authService.isLoggedIn()) {
      console.log("trying");
     // this.navCrtlIn.setRoot(LoginPage);
     // this.navCrtlIn.push(LoginPage);
    }
    return true;
  }
}
