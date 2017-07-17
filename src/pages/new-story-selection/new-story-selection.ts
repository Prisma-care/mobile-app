import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NewStoryPage} from "../new-story/new-story";


@Component({
  selector: 'page-new-story-selection',
  templateUrl: 'new-story-selection.html',
})
export class NewStorySelectionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  addText(){
    this.navCtrl.push(NewStoryPage);
  }


}
