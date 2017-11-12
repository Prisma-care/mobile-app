import {Component} from '@angular/core';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {AuthenticationComponent} from '../../authentication.component';

@Component({
  selector: 'prisma-intro',
  template: `
    <ion-content>
        <img src="assets/img/introPage/intro.jpg"/>
        <h1>Kleur jullie <br/> herinneringen</h1>
        <button ion-button full large (click)="onRegister(true)">Registreer</button>
        <p class="alternate-option" (click)="onRegister(false)">
         Al een account?
        <a color="general">
          Meld je aan.
        </a>
      </p>
    </ion-content>

  `
})
export class IntroComponent {
  constructor(private navCtrl: NavController) {}

  onRegister(value: boolean) {
    this.navCtrl.push(AuthenticationComponent, {
      isLogging: value
    });
  }
}
