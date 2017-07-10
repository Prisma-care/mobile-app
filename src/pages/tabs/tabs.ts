import { Component } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';

import { StoriesPage } from '../stories/stories';
import { BrowsePage } from '../browse/browse';
import { PatientProfilePage } from '../patientprofile/patientprofile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = BrowsePage;
 
  tab4Root = PatientProfilePage;
  
  constructor(
    public actionsheetCtrl: ActionSheetController
  ) { }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Verhaal toevoegen',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Foto nemen',
          icon: 'camera',
          handler: () => {
            console.log('Take photo');
          }
        },
        {
          text: 'Foto kiezen uit galerij',
          icon: 'images',
          handler: () => {
            console.log('Browse gallery');
          }
        },
      ]
    });
    actionSheet.present();
  }
}
