import {Component, ViewChild, OnInit} from "@angular/core";
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
import {Analytics} from '../providers/analytics';
import {AuthenticationPage} from './auth/authentication.component';
import {AlbumsPage} from '../pages/albums/albums';
import {AuthenticationService} from './core/authentication.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;
  rootPage: any = AuthenticationPage;
  private translate: TranslateService;
  private translator: TranslatorService;


  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public patientService: PatientService, public translatorService: TranslatorService,
              public authService: AuthenticationService, public menu: MenuController,
              public storyService: StoryService,
              private analytics: Analytics) {
  }

  ngOnInit() {
    //TODO: delete translator
    this.translatorService.refresh();
    this.translate = this.translatorService.translateIn;
    this.translator = this.translatorService;

    this.authService.autoLoad()
    if(this.authService.isLoggedIn()){
      this.storyService.getAlbums(this.authService.getCurrentPatient().patient_id)
      this.nav.setRoot(AlbumsPage)
    }
    localStorage.setItem(env.lastestUsedVersion, CURENT_VERSION);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.analytics.track('AppComponent::Prisma launched');
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
