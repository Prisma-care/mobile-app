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
    console.log("trying to log : " + this.authService.isLoggedIn());
    return this.authService.isLoggedIn();
  }
}
