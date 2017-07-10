import { Component } from '@angular/core';

import { Platform, ActionSheetController } from 'ionic-angular';

@Component({
	selector: 'page-addstory',
  	templateUrl: 'addstory.html'
})
export class AddStoryPage {
  constructor(
    public platform: Platform,
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