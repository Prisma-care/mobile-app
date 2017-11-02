import {Component, OnInit} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {NewLovedonePage} from './components/new-lovedone/new-lovedone';
import {AlbumListPage} from "../albumList/albumList.component";
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'prisma-authentication-page',
  template: `
    <ion-header>
      <prisma-authentication-header [title]="title"></prisma-authentication-header>
    </ion-header>
    <ion-content no-bounce>
      <!--  Login case -->
      <prisma-authentication-login
        *ngIf="isLogging"
        [onRegisterClick]="toggleForm"
        [onComplete]="onLoginComplete"
      ></prisma-authentication-login>
      <prisma-authentication-register
        *ngIf="!isLogging"
        [onLoginClick]="toggleForm"
        [onComplete]="onRegisterComplete"
      ></prisma-authentication-register>
    </ion-content>
  `,
})
export class AuthenticationPage implements OnInit{

  isLogging: boolean = true;
  title:string;

  constructor(private navCtrl: NavController,
              private menuCtrl: MenuController,
              private navParams: NavParams) {

    this.toggleForm = this.toggleForm.bind(this);
    this.onLoginComplete = this.onLoginComplete.bind(this);
    this.onRegisterComplete = this.onRegisterComplete.bind(this);
  }

  ngOnInit(): void {
    this.isLogging = this.navParams.get('isLogging')
    this.isLogging ? this.title="Meld je aan" : this.title="Registreer"
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  toggleForm() {
    this.isLogging = !this.isLogging;
    this.isLogging ? this.title="Meld je aan" : this.title="Registreer"
  }

  onLoginComplete() {
    this.navCtrl.setRoot(AlbumListPage);
  }

  onRegisterComplete() {
    this.navCtrl.setRoot(NewLovedonePage);
  }

}
