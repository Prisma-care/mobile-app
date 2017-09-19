import {Component, ViewChild} from "@angular/core";
import {MenuController, Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {PatientService} from "../providers/back-end/user.service";
import {LoginPage} from "../pages/login/login";
import {AuthService} from "../providers/auth-service/auth-service";
import {TranslatorService} from "../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";
import {InvitePage} from "../pages/invite/invite";
import {StoryService} from "../providers/back-end/story.service";
import {CURENT_VERSION, env} from "./environment";
import {Mixpanel} from '@ionic-native/mixpanel';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  private translate: TranslateService;
  private translator: TranslatorService;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              public patientService: PatientService, public translatorService: TranslatorService,
              public authService: AuthService, public menu: MenuController,
              public storyService: StoryService,
              private mixpanel: Mixpanel) {
    //localStorage.clear();
    translatorService.refresh();
    this.translate = translatorService.translateIn;
    this.translator = translatorService;
    if (this.authService.isLoggedIn()) {
      let lastestUsedVersion: string = localStorage.getItem(env.lastestUsedVersion);
      let currentVersion: string = CURENT_VERSION;

      if (lastestUsedVersion) {
        if (lastestUsedVersion.indexOf(currentVersion) != 0 || lastestUsedVersion.length != currentVersion.length)
          this.logout();
      } else {
        this.logout();
      }
      this.storyService.getAlbums(this.authService.getCurrentPatient().patient_id).toPromise().then(res => {
        if (!this.authService.isLoggedIn())
          this.logout();
      });
    }
    localStorage.setItem(env.lastestUsedVersion, CURENT_VERSION);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });


    this.mixpanel.init('7cfdbb200c3ee86ff8b5c1deda4b7b24')
      .then((success) => {
        this.mixpanel.track("Prisma launched");
      })
      .catch((err) => {
        console.log('Error mixpanel.init', err)
      });
  }

  logout() {
    this.menu.close();
    this.authService.logout();
    this.nav.setRoot(LoginPage);
  }

  invite() {
    this.menu.close();
    this.nav.push(InvitePage, {
      "patientId": this.authService.getCurrentPatient().patient_id
    });
  }
}
