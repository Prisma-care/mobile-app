import {Injectable} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {AlertController, LoadingController, Platform, ToastController} from "ionic-angular";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";


declare var cordova: any;
@Injectable()
export class UtilService {

  constructor(public alertCtrl: AlertController, private camera: Camera, private file: File,
              private fileChooser: FileChooser, private filePath: FilePath, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,) {

  }

  // Picture related stuff.
  takeAPicture(): Promise<any> {
    return this.takePicture(this.camera.PictureSourceType.CAMERA);
  }

  chooseAFile(): Promise<any> {
    return this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  public takePicture(sourceType?): Promise<string> {
    if (!sourceType)
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    // Create options for the Camera Dialog
    var options = {
      quality: 40,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    };
    // Get the data of an image
    return this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        return this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            return this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(lastImage => {return lastImage});
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        return this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(lastImage => {return lastImage});
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  public createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  public copyFileToLocalDir(namePath, currentName, newFileName): Promise<string> {
    return this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      return newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  public presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 8000,
      position: 'rigth',
      closeButtonText: "Ok"
    });
    toast.present();
  }

// Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
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
