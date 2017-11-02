import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {NewLovedonePage} from './components/new-lovedone/new-lovedone';
import {AlbumListPage} from "../albumList/albumList.component";

@Component({
  selector: 'prisma-authentication-page',
  template: `
    <ion-content padding no-bounce>

      <prisma-authentication-header></prisma-authentication-header>

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
export class AuthenticationPage {

  isLogging: boolean = true;

  constructor(private navCtrl: NavController,
              private menuCtrl: MenuController) {

    this.toggleForm = this.toggleForm.bind(this);
    this.onLoginComplete = this.onLoginComplete.bind(this);
    this.onRegisterComplete = this.onRegisterComplete.bind(this);

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  toggleForm() {
    this.isLogging = !this.isLogging;
  }

  onLoginComplete() {
    this.navCtrl.setRoot(AlbumListPage);
  }

  onRegisterComplete() {
    this.navCtrl.setRoot(NewLovedonePage);
  }

}
