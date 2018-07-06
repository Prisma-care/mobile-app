import {Component, ViewChild, OnInit, Inject} from '@angular/core';
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
import {ConstantToken} from './di';
import {Constant} from '../shared/types';

import {Observable} from 'rxjs/Rx';
import {switchMap, timeout, tap} from 'rxjs/operators';
import {UserService} from './core/user.service';
import {FullstoryService} from './core/fullstory.service';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private patientService: PatientService,
    private userService: UserService,
    private authService: AuthenticationService,
    private albumService: AlbumService,
    private mixpanel: MixpanelService,
    private fullstory: FullstoryService,
    private network: Network,
    @Inject(ConstantToken) private constants: Constant
  ) {}

  ngOnInit() {
    // this.nav.setRoot(IntroComponent);
    this.authService.autoLoad();
    this.authService.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated && this.network.type !== 'none') {
        this.albumService.getAlbums(
          this.patientService.getCurrentPatient().patient_id
        );
        this.patientService.getCurrentPatient()
          ? this.nav.setRoot(AlbumListComponent)
          : this.nav.setRoot(NewLovedoneComponent); // logged in, but no Loved One yet? then above would fail...
      } else {
        // not authenticated, use default

        this.authService
          .login(this.constants.defaultUsername, this.constants.defaultPassword)
          .pipe(
            switchMap((res: boolean | Error) => {
              if (res instanceof Error) {
                this.mixpanel.track(
                  'LoginComponent::Login error',
                  this.constants.defaultUsername
                );
                // this.showError(res.message);
                return Observable.empty();
              }
              return Observable.of(res);
            }),
            timeout(10000),
            tap(() => {
              this.mixpanel.identify(this.userService.getCurrentUser());
              this.fullstory.identify(this.userService.getCurrentUser());
              this.mixpanel.track(
                'LoginComponent::Login success',
                this.userService.getCurrentUser().email
              );
              this.patientService.getCurrentPatient();
              this.nav.setRoot(AlbumListComponent);
            })
          )
          .subscribe();
      }

      this.platform.ready().then(() => {
        this.splashScreen.hide();
      });
    });

    this.mixpanel.track('AppComponent::Prisma launched');
  }
}
