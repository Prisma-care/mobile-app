import { Component, ViewChild, OnInit } from "@angular/core";
import { Platform, Nav } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { Analytics } from '../providers/analytics';
import { AuthenticationService } from './core/authentication.service';
import { PatientService } from "./core/patient.service";
import { NewLovedonePage } from "./auth/components/new-lovedone/new-lovedone";
import { AlbumService } from "./core/album.service";
import { AlbumListPage } from "./albumList/albumList.component";
import { Network } from "@ionic-native/network";
import { IntroPage } from "./auth/components/intro/intro.component";

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform,
              public splashScreen: SplashScreen,
              public patientService: PatientService,
              public authService: AuthenticationService,
              private albumService: AlbumService,
              private analytics: Analytics,
              private statusBar: StatusBar,
              private network: Network) {
  }

  ngOnInit() {

    this.nav.setRoot(IntroPage);
    this.authService.autoLoad();
    if (this.authService.isLoggedIn() && this.network.type !== 'none') {
      this.albumService.getAlbums(this.patientService.getCurrentPatient().patient_id);
      this.patientService.getCurrentPatient() ? this.nav.setRoot(AlbumListPage) : this.nav.setRoot(NewLovedonePage);
    }

    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
    this.analytics.track('AppComponent::Prisma launched');
  }


}
