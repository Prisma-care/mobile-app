import {Injectable} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {AlertController, LoadingController, Platform, ToastController} from "ionic-angular";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";


declare var cordova: any;

@Injectable()
export class UtilService {

  constructor(public alertCtrl: AlertController, private camera: Camera, private file: File,
              private filePath: FilePath, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,) {

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
      quality: 90,
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
            return this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(lastImage => {
              return lastImage
            });
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        return this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then(lastImage => {
          return lastImage
        });
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
      position: 'top',
      closeButtonText: "Ok",
      showCloseButton: true,
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

  public getEmailPattern(): string {
    //  return '^[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$';
    return '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
  }

  public checkEmail(email: string): boolean {
    if (!email)
      return false;
    let emailRegex = this.getEmailPattern();
    if (!email.toLowerCase().match(emailRegex)) {
      return false;
    }
    return true;
  }

  public getPasswordPattern(): string {
    return '^.{3,8}$';
  }

  public checkPassword(password: string): boolean {
    if (!password)
      return false;
    // let passwordRegex = '/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{4,20}$/';
    let passwordRegex = this.getPasswordPattern();
    if (!password.match(passwordRegex)) {
      return false;
    }
    return true;
  }

  // Youtube related

  public getYoutubeLinkPattern(): string {
    return 'http(?:s?):\\/\\/(?:www\\.)?youtu(?:be\\.com\\/watch\\?v=|\\.be\\/)([\\w\\-\\_]*)(&(amp;)?‌​[\\w\\?‌​=]*)?';
  }

  public checkYoutubeLink(youtubeLink: string): boolean {
    if (!youtubeLink)
      return false;
    let youtubeLinkRegex = this.getYoutubeLinkPattern();
    if (!youtubeLink.match(youtubeLinkRegex)) {
      return false;
    }
    return true;
  }

  public getYoutubeId(url: string): string {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return '';
    }
  }

  getThumb(url: string) {
    if (!url)
      return url;
    if (url.toLowerCase().indexOf("youtube.com") >= 0) {
      let videoId = this.getYoutubeId(url);
      if (!videoId)
        return url;
      let thumbailLink = "http://img.youtube.com/vi/" + videoId + "/0.jpg";
      return thumbailLink;
    } else {
      return url;
    }
  }

  showErrorMessage(errorMessage: string, alertController?: AlertController): Promise<any> {
    let aletCtrl = alertController || this.alertCtrl;
    let alert = aletCtrl.create({
      title: "Error",
      subTitle: errorMessage,
      buttons: ['Ok']
    });

    return alert.present();
  }


}
