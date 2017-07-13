import {Component} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";

import {StoriesPage} from "../stories/stories";
import {BrowsePage} from "../browse/browse";
import {PatientProfilePage} from "../patientprofile/patientprofile";

import { Camera } from '@ionic-native/camera';
import {NewStoryPage} from "../new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = BrowsePage;

  tab4Root = PatientProfilePage;

   base64Image: string;

  constructor(public actionsheetCtrl: ActionSheetController,private camera: Camera,public navCtrl: NavController,private fileChooser: FileChooser) {
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

              this.camera.getPicture({
                destinationType: this.camera
                  .DestinationType.DATA_URL,
                targetWidth: 1000,
                targetHeight: 1000
              }).then((imageData) => {
                // imageData is a base64 encoded string
                this.base64Image = "data:image/jpeg;base64," + imageData;
                this.navCtrl.push(NewStoryPage,{
                    "dateUrl":this.base64Image,
                })
              }, (err) => {
                console.log(err);
              });

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
