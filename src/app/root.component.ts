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

import {Observable, Subscription} from 'rxjs/Rx';
import {switchMap, timeout, tap} from 'rxjs/operators';
import {UserService} from './core/user.service';
import {FullstoryService} from './core/fullstory.service';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {NavParams} from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'prisma-root',
  template: ``
})
export class RootComponent {
  private authSub: Subscription;
  private authObs: Observable<boolean>;

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
    private navCtrl: NavController,
    private navParams: NavParams,
    @Inject(ConstantToken) private constants: Constant
  ) {
    this.authObs = this.authService.isAuthenticated;
  }

  ionViewWillEnter() {
    // this.navCtrl.setRoot(IntroComponent);
    if (!this.navParams.get('isLogging') && this.userService.isRegisteredSync) {
      this.authService.autoLoad();
    }
    this.authSub = this.authObs.subscribe(isAuthenticated => {
      if (
        this.network.type !== 'none' &&
        !this.navParams.get('isLogging') &&
        this.patientService.patientExistsSync() &&
        this.patientService._patientExists.getValue()
      ) {
        this.albumService.getAlbums(
          this.patientService.getCurrentPatient().patient_id
        );
        if (this.patientService.getCurrentPatient()) {
          // this.navCtrl.setRoot(AlbumListComponent);
        }
        // : this.navCtrl.setRoot(NewLovedoneComponent); // logged in, but no Loved One yet? then above would fail...
      } else if (!this.navParams.get('isLogging')) {
        // not authenticated, use default account
        const subAuth = this.authService
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
            // timeout(10000),
            tap(() => {
              this.mixpanel.identify(this.userService.getCurrentUser());
              this.fullstory.identify(this.userService.getCurrentUser());
              this.mixpanel.track(
                'LoginComponent::Login success',
                this.userService.getCurrentUser().email
              );
              this.patientService.getCurrentPatient();
              this.navCtrl.setRoot(AlbumListComponent);
            })
          )
          .subscribe(() => {
            subAuth.unsubscribe();
          });
      } else {
        this.navCtrl.setRoot(IntroComponent);
      }

      this.platform.ready().then(() => {
        this.splashScreen.hide();
      });
    });

    this.mixpanel.track('AppComponent::Prisma launched');
  }

  ionViewWillLeave() {
    this.authSub.unsubscribe();
  }
}
