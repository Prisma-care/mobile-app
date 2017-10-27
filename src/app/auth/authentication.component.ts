import {Component, OnInit} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {AuthenticationService} from "../core/authentication.service";
import {NewLovedonePage} from './components/new-lovedone/new-lovedone';
import {AlbumListPage} from "../albumList/albumList.component";
import {AlbumsPage} from "../../pages/albums/albums";

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
    this.isLogging = !this.isLogging;
  }

  onLoginComplete() {
    // TODO implement redirect to loved one creation if not yet connected to a loved one!
    this.navCtrl.setRoot(AlbumsPage);
  }

  onRegisterComplete() {
    this.navCtrl.setRoot(NewLovedonePage);
  }

}
