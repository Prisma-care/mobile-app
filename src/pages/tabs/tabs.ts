import {Component} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";

import {StoriesPage} from "../stories/stories";
import {BrowsePage} from "../browse/browse";
import {PatientProfilePage} from "../patientprofile/patientprofile";

import { Camera } from '@ionic-native/camera';
import {NewStoryPage} from "../new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../../services/util-service";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = BrowsePage;

  tab4Root = PatientProfilePage;
  constructor(public actionsheetCtrl: ActionSheetController,private utilService:UtilService,public navCtrl: NavController) {
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
              let base64Image:string = this.utilService.takeAPicture();
              this.navCtrl.push(NewStoryPage,{
                "dateUrl": base64Image
              })
          }
        },
        {
          text: 'Foto uit album kiezen',
          role: 'destructive ',
          icon: 'image',
          handler: () => {
            this.fileChooser.open()
              .then(uri => console.log(uri))
              .catch(e => console.log(e));
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
