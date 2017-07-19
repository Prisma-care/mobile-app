import { Component } from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {UtilService} from "../../services/util-service";
import {NewStoryPage} from "../new-story/new-story";
import {BrowsePage} from "../browse/browse";

@Component({
  selector: 'page-empty',
  templateUrl: 'empty.html',
})
export class EmptyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public  utilService:UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmptyPage');
  }
  takeAPicture(){
    let dataUrl:string = this.utilService.takeAPicture().dataUrl;
    if(!dataUrl)
      dataUrl = "assets/img/tutorial/empty-2.jpg";
    if(dataUrl){
      this.navCtrl.push(NewStoryPage,{
        "dateUrl" : dataUrl
      });
    }
  }


}
