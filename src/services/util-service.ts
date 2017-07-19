import {Injectable} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {AlertController} from "ionic-angular";


@Injectable()
export class UtilService{


  constructor(public alertCtrl: AlertController,private camera: Camera,private fileChooser: FileChooser){

  }

  pictureOptions : CameraOptions = {
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 1000,
    targetHeight: 1000
  };

  takeAPicture(): Promise<any> {
    let dataUrl:string ="";
    let error:string;
    return this.camera.getPicture(this.pictureOptions).then((imageData) => {
      // imageData is a base64 encoded string
      return dataUrl = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      this.showErrorMessage("Error for taking a pic :" + err);
      return err;
    });
  }

  chooseAFile():{dataUrl:string,error:string}{
    let dataUrl:string ="";
    let error:string;
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }).then((imageData) => {
      // imageData is a base64 encoded string
      console.log(imageData);
      dataUrl = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      error=err;
    });
    //this.camera.cleanup().then();
    return {dataUrl:dataUrl,error:error};
  }

  showErrorMessage(errorMessage:string):Promise<any>{
    let alert = this.alertCtrl.create({
      title:"Error",
      subTitle: errorMessage,
      buttons: ['Ok']
    });
    console.log(errorMessage);
    return  alert.present();
  }
}
