import {Component} from '@angular/core';
import {
  ActionSheetController,
  AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {TutorialPage} from "../tutorial/tutorial";
import {PatientService} from "../../services/back-end/user.service";
import {Patient} from "../../dto/patient";
import {StoryService} from "../../services/back-end/story.service";
import {Album} from "../../dto/album";
import {UtilService} from "../../services/util-service";
import {UserStory} from "../../dto/user-story";
import {StoryType} from "../../dto/enum/story-type";
import {StoriesPage} from "../stories/stories";
import {API_URL, env} from "../../app/environment";
import {FileTransferObject, FileUploadOptions, FileTransfer} from "@ionic-native/file-transfer";
import {FilePath} from "@ionic-native/file-path";
import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from "@ionic-native/transfer";
import {Camera} from "@ionic-native/camera";

declare var cordova: any;
@Component({
  selector: 'page-api-testing',
  templateUrl: 'api-testing.html',
})

export class ApiTestingPage {

  public patientToAdd: Patient = new Patient();
  public patientAdded: Patient = new Patient();
  public patientAddedAlbums: Album[] = [];
  public userStory: UserStory = new UserStory();
  fileTransfer: FileTransferObject;
  lastImage: string = null;
  loading: Loading;
  error:string;

  static targetPathS:String;
  targetPathSS:String =ApiTestingPage.targetPathS;
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
              public patientService: PatientService, public storySerivce: StoryService,
              public utilService: UtilService, private transfer2: FileTransfer, public alertCtrl: AlertController) {
    this.fileTransfer = this.transfer2.create();
  }

  ionViewDidLoad() {
    this.patientService.getPatient("3").toPromise().then(res => {
      this.patientAdded = res;
    })
    this.storySerivce.getAlbums(this.patientAdded.id).toPromise().then(res => this.patientAddedAlbums = res);
    this.storySerivce.getUserStory(this.patientAdded.id, "10").toPromise().then(res => this.userStory = res);
  }

  backToTuto() {
    this.navCtrl.push(TutorialPage);
  }

  addUser() {
    this.patientService.addPatient(this.patientToAdd).toPromise().then(res => {
      this.patientService.getPatient(res.id).toPromise().then(res2 => {
        this.patientAdded = res2
      })
    })
  }

  generateAlbums() {
    this.storySerivce.generateBasicAlbums(this.patientAdded.id).toPromise().then(res => {
      this.patientAddedAlbums = res;
    })
  }

  addStory(){
    let newStory: UserStory = new UserStory();
    //newStory.albumId = this.patientAddedAlbums[2].id;
    // newStory.dateAdded = new Date();
    newStory.description = "1";
    newStory.favorited = true;
    newStory.albumId = 3;
    newStory.creatorId = 1;
    this.storySerivce.addStory(1,newStory).toPromise().then(res => this.userStory = res);
  }
  tryUploading() {
    this.upload().then(res => console.log("Uploaded done " + JSON.stringify(res)));
  }


  uploadTest() {
    let _head: Headers = new Headers({'Content-Type': 'multipart-form/data'});
    _head.set('Access-Control-Allow-Origin', API_URL);
    // Request methods you wish to allow
    _head.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Set to true if you need the website to include cookies in  requests
    _head.set('Access-Control-Allow-Credentials', JSON.stringify(true));
    _head.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    var jwt = localStorage.getItem(env.jwtToken);
    _head.set('Authorization', 'Bearer ' + jwt);

    let options: FileUploadOptions = {};

    let newStory: UserStory = new UserStory();
    // newStory.albumId = +this.patientAddedAlbums[2].id;
    // newStory.dateAdded = new Date();
    newStory.description = "Just Testing 2";
    // if(this.dataUrl)
    // newStory.source = this.dataUrl.indexOf("assets/img/t/anne.jpg") > -1 ? "anne.jpg" : this.dataUrl;
    ///newStory.type = StoryType.IMAGE;
    newStory.creatorId = 1;
    //this.storySerivce.oldAddStory(3, this.patientAddedAlbums[2], newStory).toPromise().then(res => {
    // newStory = res;
    //console.log("got the story :" + JSON.stringify(res));

    // this.utilService.takeAPicture().then(res => {
    this.fileTransfer.upload("empty-1.jpg", API_URL + '/' + env.api.getPatient + '/' + 3 + '/' + env.api.getStory + '/' + 10 + '/' + env.api.getAsset, options)
      .then((data) => {
        console.log("got the data");
        newStory.source = data.response;
        this.userStory = newStory;
      }, (err) => {
        // error
        console.log("Erreur : " + err);
      });
    //  });

  }

  upload(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.utilService.takeAPicture().then(res => {
        let formData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        if (res) {
          formData.append('file', res);
        } else {
          return;
        }
        ;

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(JSON.stringify(xhr.response));
            } else {
              reject(xhr.response);
            }
          }
        };

        //FileUploadService.setUploadUpdateInterval(500);

        /**xhr.upload.onprogress = (event) => {
       this.progress = Math.round(event.loaded / event.total * 100);

       //this.progressObserver.next(this.progress);

       };*/

        let newStory: UserStory = new UserStory();
        //newStory.albumId = this.patientAddedAlbums[2].id;
        // newStory.dateAdded = new Date();
        newStory.description = "Just Testing 2";
        newStory.albumId =  +this.patientAddedAlbums[2].id;
        // if(this.dataUrl)
        // newStory.source = this.dataUrl.indexOf("assets/img/t/anne.jpg") > -1 ? "anne.jpg" : this.dataUrl;
        ///newStory.type = StoryType.IMAGE;
        // newStory.title = "test";
        this.storySerivce.addStory(3, newStory).toPromise().then(res => {
          //this.navCtrl.push(StoriesPage);
        });
        //formData.append('file', JSON.stringify(u));
        xhr.open('POST', API_URL + '/' + env.api.getPatient + '/' + 3 + '/' + env.api.getStory + '/' + newStory.id + '/' + env.api.getAsset, true);
        xhr.send(formData);
        // this.refresh();
      }).catch(this.handleError);
    })

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    //this.util.setFailed('File could not be uploaded');
    return Promise.reject(error.message || error);
  }


  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType?) {
    if(!sourceType)
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    // Create options for the Camera Dialog
    var options = {
      quality: 10,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

// Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 900
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

  public uploadImage() {
    // Destination URL
    var url =  API_URL + '/' + env.api.getPatient + '/' + 1 + '/' + env.api.getStory + '/' + 19 + '/' + env.api.getAsset;

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
    ApiTestingPage.targetPathS = targetPath;
    this.targetPathSS = targetPath;
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded. : ' + targetPath + "\n" + JSON.stringify(data));
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.' +'\n' + JSON.stringify(err));
      this.error = 'Error while uploading file.' +'\n' + JSON.stringify(err);
    });
  }
}
