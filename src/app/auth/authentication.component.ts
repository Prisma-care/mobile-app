import {Component, OnInit} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {AuthenticationService} from "../core/authentication.service";
import {AlbumsPage} from '../../pages/albums/albums';

@Component({
  selector: 'prisma-authentication-page',
  templateUrl: 'authentication.component.html',
})
export class AuthenticationPage implements OnInit {

  isSigningUp: boolean = false;

  constructor(private navCtrl: NavController,
              private auth: AuthenticationService,
              private menuCtrl: MenuController) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      console.log('this.auth',this.auth.getCurrentUser());
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
    this.isSigningUp = !this.isSigningUp;
  }

  complete() {
    // TODO implement redirect to loved one creation if not yet connected to a loved one!
    this.navCtrl.setRoot(AlbumsPage);
  }

}
