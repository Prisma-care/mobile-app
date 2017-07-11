import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-new-story',
  templateUrl: 'new-story.html',
})
export class NewStoryPage {

   dataUrl:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dataUrl = navParams.get("dataUrl") as string;
  }


}
