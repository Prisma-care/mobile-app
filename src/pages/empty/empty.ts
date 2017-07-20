import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {UtilService} from "../../services/util-service";
import {NewStoryPage} from "../new-story/new-story";

@Component({
  selector: 'page-empty',
  templateUrl: 'empty.html',
})
export class EmptyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public  utilService: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmptyPage');
  }

  takeAPicture() {
    let pictureAttempt: Promise<any> = this.utilService.takeAPicture();

    pictureAttempt.then(
      (dataUrl) => {
        this.navCtrl.push(NewStoryPage,
          {"dataUrl": dataUrl})
      });
  }

}
