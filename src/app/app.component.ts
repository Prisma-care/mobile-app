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
import {RootComponent} from './root.component';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  rootParams = {isLogging: false};

  rootPage = RootComponent;

  constructor() {}
}
