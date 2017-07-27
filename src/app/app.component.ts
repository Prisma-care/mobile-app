import {Component, ViewChild} from "@angular/core";
import {MenuController, Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {PatientService} from "../providers/back-end/user.service";
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth-service/auth-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public patientService: PatientService, public authService: AuthService, public menu: MenuController) {
    //localStorage.clear();
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
