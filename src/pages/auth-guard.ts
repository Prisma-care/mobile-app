import {AuthService} from "../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";
import {LoginPage} from "./login/login";
import {Injectable} from "@angular/core";
import {TranslatorService} from "../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";


@Injectable()
export class AuthGuard {
  //General injection
  private translate: TranslateService;
  private translator:TranslatorService;

  constructor(protected authService: AuthService, protected  navCtrl: NavController,public translatorService: TranslatorService) {
    translatorService.refresh();
    this.translate = translatorService.translate;
    this.translator = translatorService;
  }

  ionViewCanEnter(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.navCtrl.setRoot(LoginPage).then(res => {
        this.navCtrl.popToRoot();
        return false;
      });
    } else {
      return true;
    }
  }
}
