import {Injectable} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";


@Injectable()
export class UtilService{


  constructor(private camera: Camera,private fileChooser: FileChooser){

  }

  takeAPicture(): string{
    let dataUrl:string ="";
    this.camera.getPicture({
      destinationType: this.camera
        .DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      dataUrl = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log("Error for taking a pic :" + err);
    });
    return dataUrl;
  }

  chooseAFile():string{
    let dataUrl:string = "";
    this.fileChooser.open()
      .then(uri => dataUrl = uri)
      .catch(e => console.log("Error for chosing a file : " + e));
    return dataUrl;
  }
}
