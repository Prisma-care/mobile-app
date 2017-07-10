import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-storydetails',
  templateUrl: 'storydetails.html'
})
export class StoryDetailsPage {
  public album;
  public index:number;


  //Just for testing
  public likes:number=12;
  public hasLiked=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.album = navParams.get("album");
    this.index = navParams.get("index");
    this.likes = this.index * 3;
  }

  addLike(){
    console.log("addigng likes");
    this.likes = this.hasLiked ? this.likes+1 : this.likes -1;
    this.hasLiked = ! this.hasLiked;
  }
}
