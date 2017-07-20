import {Injectable} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {AlertController} from "ionic-angular";


@Injectable()
export class UtilService {


  constructor(public alertCtrl: AlertController, private camera: Camera, private fileChooser: FileChooser) {

  }

  pictureOptions: CameraOptions = {
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 1000,
    targetHeight: 1000,
    correctOrientation: true
  };

  takeAPicture(): Promise<any> {
    return this.camera.getPicture(this.pictureOptions).then((imageData) => {
      // imageData is a base64 encoded string
      return "data:image/jpeg;base64," + imageData;
    }, (err) => {
      this.showErrorMessage("Error for taking a pic :" + err);
      return err;
    });
  }

  chooseFileOption: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    mediaType: this.camera.MediaType.PICTURE
  }

  chooseAFile(): Promise<any> {
    return this.camera.getPicture(this.chooseFileOption).then((imageData) => {
      // imageData is a base64 encoded string
      return "data:image/jpeg;base64," + imageData;
    }, (err) => {
      this.showErrorMessage("Error for taking a pic :" + err);
      return err;
    });
  }

  showErrorMessage(errorMessage: string): Promise<any> {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: errorMessage,
      buttons: ['Ok']
    });
    console.log(errorMessage);
    return alert.present();
  }
}
