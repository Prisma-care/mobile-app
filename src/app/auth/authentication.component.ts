import {Component, OnInit} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {AuthenticationService} from "../core/authentication.service";
import {AlbumsPage} from '../../pages/albums/albums';
import {NewLovedonePage} from '../../pages/new-lovedone/new-lovedone';

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
export class AuthenticationPage implements OnInit {

  isLogging: boolean = true;

  constructor(private navCtrl: NavController,
              private auth: AuthenticationService,
              private menuCtrl: MenuController) {

    this.toggleForm = this.toggleForm.bind(this);
    this.onLoginComplete = this.onLoginComplete.bind(this);
    this.onRegisterComplete = this.onRegisterComplete.bind(this);
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      console.log('this.auth', this.auth.getCurrentUser());
      this.navCtrl.setRoot(AlbumsPage);
    }
  }

  ionViewCanLeave(): boolean {
    return true;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  toggleForm() {
    console.log('toggleFormBef', this.isLogging)

    this.isLogging = !this.isLogging;
    console.log('toggleForm', this.isLogging)
  }

  onLoginComplete() {
    console.log('onLoginComplete');

    // TODO implement redirect to loved one creation if not yet connected to a loved one!
    this.navCtrl.setRoot(AlbumsPage);
  }

  onRegisterComplete() {
    console.log('onRegisterComplete');

    this.navCtrl.setRoot(NewLovedonePage);
  }

}
