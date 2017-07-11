import {Component} from "@angular/core";
import {ActionSheetController} from "ionic-angular";

import {StoriesPage} from "../stories/stories";
import {BrowsePage} from "../browse/browse";
import {PatientProfilePage} from "../patientprofile/patientprofile";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = BrowsePage;

  tab4Root = PatientProfilePage;

  constructor(public actionsheetCtrl: ActionSheetController) {
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Verhaal toevoegen',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Foto nemen',
          role: 'destructive ',
          icon: 'camera',
          handler: () => {
            console.log('addPhoto clicked');
          }
        },
        {
          text: 'Foto uit album kiezen',
          role: 'destructive ',
          icon: 'image',
          handler: () => {
            console.log('addPhoto  with album clicked');
          }
        },
        {
          text: 'Youtube video kiezen',
          role: 'destructive ',
          icon: 'logo-youtube',
          handler: () => {
            console.log('choose youtube video clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel ',
          icon: 'md-arrow-back',
          handler: () => {
            console.log('canceled');
          }
        },
      ]

  })
    ;
    actionSheet.present();
  }
}
