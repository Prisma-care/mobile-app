import {Component, ViewChild, OnInit} from "@angular/core";
import {Platform, Nav} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {TranslatorService} from "../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";
import {Analytics} from '../providers/analytics';
import {AuthenticationPage} from './auth/authentication.component';
import {AlbumsPage} from '../pages/albums/albums';
import {AuthenticationService} from './core/authentication.service';
import {PatientService} from "./core/patient.service";
import {NewLovedonePage} from "./auth/components/new-lovedone/new-lovedone";
import {AlbumService} from "./core/album.service";

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
              private albumService:AlbumService,
              private analytics: Analytics,
              private statusBar: StatusBar
              ) {
  }

  ngOnInit() {
    //TODO: delete translator
    this.translatorService.refresh();
    this.translate = this.translatorService.translateIn;
    this.translator = this.translatorService;

    this.authService.autoLoad();
    if(this.authService.isLoggedIn()){
      this.albumService.getAlbums(this.patientService.getCurrentPatient().patient_id);
      this.patientService.getCurrentPatient() ? this.nav.setRoot(AlbumsPage):this.nav.setRoot(NewLovedonePage);
    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.analytics.track('AppComponent::Prisma launched');
 }


}
