import { Component } from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {NewStoryPage} from "../new-story/new-story";
import {UtilService} from "../../services/util-service";


@Component({
  selector: 'page-new-story-selection',
  templateUrl: 'new-story-selection.html',
})
export class NewStorySelectionPage {

  constructor(public actionsheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams,public utilService:UtilService) {
  }


  addText(){
    this.navCtrl.push(NewStoryPage);
  }
  
  cameraActionSheet(){
    let actionSheet = this.actionsheetCtrl.create({
        title: 'Foto toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Maak foto',
            role: 'destructive ',
            icon: 'camera',
            cssClass: 'general',
            handler: () => {
              let base64Image:string = this.utilService.takeAPicture();
              this.navCtrl.push(NewStoryPage,{
                "dateUrl": base64Image
              })
            }
          },
          {
            text: 'Kies foto van camerarol',
            role: 'destructive ',
            icon: 'image',
            handler: () => {
              console.log('addPhoto  with album clicked');
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
