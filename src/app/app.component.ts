import {Component, ViewChild, OnInit} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';

import {MixpanelService} from './core/mixpanel.service';
import {AuthenticationService} from './core/authentication.service';
import {PatientService} from './core/patient.service';
import {NewLovedoneComponent} from './auth/components/new-lovedone/new-lovedone';
import {AlbumService} from './core/album.service';
import {AlbumListComponent} from './albumList/albumList.component';
import {Network} from '@ionic-native/network';
import {IntroComponent} from './auth/components/intro/intro.component';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private albumService: AlbumService,
    private mixpanel: MixpanelService,
    private network: Network
  ) {}

  ngOnInit() {
    this.nav.setRoot(IntroComponent);
    this.authService.autoLoad();
    if (this.authService.isLoggedIn() && this.network.type !== 'none') {
      this.albumService.getAlbums(
        this.patientService.getCurrentPatient().patient_id
      );
      this.patientService.getCurrentPatient()
        ? this.nav.setRoot(AlbumListComponent)
        : this.nav.setRoot(NewLovedoneComponent);
    }

    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
    this.mixpanel.track('AppComponent::Prisma launched');
  }
}
