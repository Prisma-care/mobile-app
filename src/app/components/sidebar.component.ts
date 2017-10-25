
import {Component, ViewChild, Input} from "@angular/core";
import {AuthenticationPage} from "../auth/authentication.component";
import {MenuController, Nav} from "ionic-angular";
import {AuthenticationService} from "../core/authentication.service";
import {InvitePage} from "../../pages/invite/invite";
import {PatientService} from "../core/patient.service";

@Component({
  selector: 'prisma-sidebar',
  template: `<ion-menu [content]="content" color="white">
    <ion-content>
      <ion-toolbar color="white">
        <ion-title style="color: #FFABAEB4">Menu</ion-title>
      </ion-toolbar>
      <ion-list>
        <button ion-item (click)="invite()" *ngIf="patientService.getCurrentPatient()" class="ion-menu-buttons">
          <ion-icon name="person-add" color="general"></ion-icon>
          Nodig iemand uit
        </button>
        <button ion-item (click)="logout()" class="ion-menu-buttons">
          <ion-icon name="exit" color="general"></ion-icon>
          Afmelden
        </button>
      </ion-list>
    </ion-content>
  </ion-menu>
  `
})
export class SidebarComponent {
  @Input()
  nav

  @Input()
  content

  constructor(
    public menu: MenuController,
    public authService: AuthenticationService,
    public patientService: PatientService) {
  }

  logout() {
    this.menu.close();
    this.authService.logout();
    this.nav.setRoot(AuthenticationPage);
  }

  invite() {
    this.menu.close();
    this.nav.push(InvitePage, {
      "patientId": this.patientService.getCurrentPatient().patient_id
    });
  }
}
