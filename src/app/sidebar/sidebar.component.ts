import {Component, Input} from '@angular/core';
import {MenuController} from 'ionic-angular';
import {AuthenticationService} from '../core/authentication.service';
import {InviteComponent} from './component/invite/invite';
import {PatientService} from '../core/patient.service';
import {GiveFeedbackComponent} from './component/giveFeedback/giveFeedback.component';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {IntroComponent} from '../auth/components/intro/intro.component';

@Component({
  selector: 'prisma-sidebar',
  template: `<ion-menu [content]="content" color="white">
    <ion-content>
      <ion-toolbar color="white">
        <ion-title class="ion-title-color">Menu</ion-title>
      </ion-toolbar>
      <ion-list>
        <button ion-item (click)="invite()" class="ion-menu-buttons">
          <ion-icon name="person-add" color="general"></ion-icon>
          Nodig iemand uit
        </button>
        <button ion-item (click)="goToFeedbackPage()" class="ion-menu-buttons">
          <ion-icon name="mail" color="general"></ion-icon>
          Geef feedback
        </button>
        <button ion-item (click)="logout()" class="ion-menu-buttons">
          <ion-icon name="exit" color="general"></ion-icon>
          Afmelden
        </button>
      </ion-list>
    </ion-content>
  </ion-menu>
  `,
  styles: [
    `
      .ion-title-color {
        color: #FFABAEB4
      }
    `
  ]
})
export class SidebarComponent {
  @Input() nav: NavController;

  @Input() content;

  constructor(
    public menu: MenuController,
    public authService: AuthenticationService,
    public patientService: PatientService
  ) {}

  logout() {
    this.menu.close();
    this.authService.logout();
    this.nav.setRoot(IntroComponent);
  }

  invite() {
    this.menu.close();
    this.nav.push(InviteComponent, {
      patientId: this.patientService.getCurrentPatient().patient_id
    });
  }

  goToFeedbackPage() {
    this.nav.push(GiveFeedbackComponent);
  }
}
