import {Component, ViewChild, OnInit} from "@angular/core";
import {MenuController, Platform, Nav} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {TranslatorService} from "../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";
import {InvitePage} from "../pages/invite/invite";
import {StoryService} from "../providers/back-end/story.service";
import {CURENT_VERSION, env} from "./environment";
import {Analytics} from '../providers/analytics';
import {AuthenticationPage} from './auth/authentication.component';
import {AlbumsPage} from '../pages/albums/albums';
import {AuthenticationService} from './core/authentication.service';
import {PatientService} from "./core/patient.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  private translate: TranslateService;
  private translator: TranslatorService;

  @ViewChild(Nav) nav: Nav;
  rootPage: any = AuthenticationPage;

  constructor(public platform: Platform,
              public splashScreen: SplashScreen,
              public patientService: PatientService, 
              public translatorService: TranslatorService,
              public authService: AuthenticationService,
              public storyService: StoryService,
              private analytics: Analytics,
              private statusBar: StatusBar
              ) {
  }

  ngOnInit() {
    //TODO: delete translator
    this.translatorService.refresh();
    this.translate = this.translatorService.translateIn;
    this.translator = this.translatorService;

    this.authService.autoLoad()
    if(this.authService.isLoggedIn()){
      this.storyService.getAlbums(this.patientService.getCurrentPatient().patient_id)
      this.nav.setRoot(AlbumsPage)
    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.analytics.track('AppComponent::Prisma launched');
 }


}
