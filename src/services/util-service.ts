import {Injectable} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {AlertController} from "ionic-angular";


@Injectable()
export class UtilService{


  constructor(public alertCtrl: AlertController,private camera: Camera,private fileChooser: FileChooser){

  }

  takeAPicture(): string{
    let dataUrl:string ="";
    this.camera.getPicture({
      destinationType:
      this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      console.log(imageData);
      dataUrl = "data:image/jpeg;base64," + imageData;
      return dataUrl;
    }, (err) => {
      let alert = this.alertCtrl.create({
        subTitle: "Error for taking a pic :" + err,
        buttons: ['OK']
      });
      alert.present();
      console.log("Error for taking a pic :" + err);
    });
    //this.camera.cleanup().then();
    return dataUrl;
  }

  chooseAFile():string{
    let dataUrl:string ="";
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }).then((imageData) => {
      // imageData is a base64 encoded string
      console.log(imageData);
      dataUrl = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      let alert = this.alertCtrl.create({
        subTitle: "Error for taking a pic :" + err,
        buttons: ['OK']
      });
      alert.present();
      console.log("Error for taking a pic :" + err);
    });
    //this.camera.cleanup().then();
    return dataUrl;
  }
}
