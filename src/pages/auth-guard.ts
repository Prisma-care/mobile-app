import {AuthService} from "../providers/auth-service/auth-service";
import {Observable} from "rxjs/Observable";
import {UtilService} from "../providers/util-service";
import {StanizerService} from "../providers/stanizer.service";
import {NavController} from "ionic-angular";
import {LoginPage} from "./login/login";
import {Injectable} from "@angular/core";


@Injectable()
export class AuthGuard {
  //General injection
  constructor(protected authService: AuthService, protected  navCrtlIn?:NavController) {

  }

  ionViewCanEnter():boolean{
   if(!this.authService.isLoggedIn())
     this.navCrtlIn.popTo(LoginPage);
    return this.authService.isLoggedIn();
  }
}
