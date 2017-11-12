import {Component, OnInit} from '@angular/core';
import {AlertController, MenuController, NavController} from 'ionic-angular';
import {NewLovedoneComponent} from './components/new-lovedone/new-lovedone';
import {AlbumListComponent} from '../albumList/albumList.component';
import {NavParams} from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'prisma-authentication',
  template: `
    <ion-header>
      <prisma-authentication-header [title]="title"></prisma-authentication-header>
    </ion-header>
    <ion-content no-bounce>
      <!--  Login case -->
      <prisma-authentication-login
        *ngIf="!isLogging"
        [onRegisterClick]="toggleForm"
        [onComplete]="onLoginComplete"
      ></prisma-authentication-login>
      <prisma-authentication-register
        *ngIf="isLogging"
        [onLoginClick]="toggleForm"
        [onComplete]="onRegisterComplete"
      ></prisma-authentication-register>
    </ion-content>
  `
})
export class AuthenticationComponent implements OnInit {
  isLogging = false;
  title: string;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private navParams: NavParams,
    private alertCtrl: AlertController
  ) {
    this.toggleForm = this.toggleForm.bind(this);
    this.onLoginComplete = this.onLoginComplete.bind(this);
    this.onRegisterComplete = this.onRegisterComplete.bind(this);
  }

  ngOnInit(): void {
    this.isLogging = this.navParams.get('isLogging');
    this.isLogging ? (this.title = 'Registreer') : (this.title = 'Meld je aan');
  }

  ionViewDidEnter() {
    const error = this.navParams.get('error');
    if (error) {
      this.alertCtrl
        .create({
          title: error,
          buttons: ['Ok']
        })
        .present();
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  toggleForm() {
    this.isLogging = !this.isLogging;
    this.isLogging ? (this.title = 'Registreer') : (this.title = 'Meld je aan');
  }

  onLoginComplete() {
    this.navCtrl.setRoot(AlbumListComponent);
  }

  onRegisterComplete() {
    this.navCtrl.setRoot(NewLovedoneComponent);
  }
}
