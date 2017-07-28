import {Component, ViewChild} from "@angular/core";
import {MenuController, Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {PatientService} from "../providers/back-end/user.service";
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth-service/auth-service";
import {TranslatorService} from "../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private translate: TranslateService;
  private translator:TranslatorService;

  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public patientService: PatientService, public translatorService: TranslatorService,public authService: AuthService, public menu: MenuController) {
    //localStorage.clear();
    translatorService.refresh();
    this.translate = translatorService.translate;
    this.translator = translatorService;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout() {
    console.log("login out");
    this.menu.close();
    this.authService.logout();
    this.nav.setRoot(LoginPage);
  }
}
