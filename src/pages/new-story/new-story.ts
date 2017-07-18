import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Camera} from "@ionic-native/camera";
import {Album} from "../../dto/album";
import {StoryService} from "../../services/back-end/story.service";
import {UserStory} from "../../dto/user-story";
import {StoryType} from "../../dto/enum/story-type";
import {StoriesPage} from "../stories/stories";

@Component({
  selector: 'page-new-story',
  templateUrl: 'new-story.html',
})
export class NewStoryPage {


  //Step 1
  dataUrl: string = "familie/family1.jpg";

  description: string;
  placeHolder: string = "Schrijf het verhaal.\nHoe meer details hoe beter.";
  //Step 2
  albums: Album[] = [];
  selectedAlbum: Album;
  title: string;
  step: number = 0;
  year:number;
  month:number;
  day:number;

  constructor(public navCtrl: NavController, private camera: Camera, public navParams: NavParams, private storyService: StoryService) {
    this.dataUrl = navParams.get("dateUrl") as string;
    this.storyService.getAlbums().toPromise().then(albums => {
      this.albums = albums as Album[];
      this.selectedAlbum = this.albums[2] || new Album();
    });

  }

  commit() {
    let newStory: UserStory = new UserStory();
    newStory.albumId = this.selectedAlbum.id;
    newStory.dateAdded = new Date();
    if(this.year) {
      newStory.date = new Date();
      newStory.date.setFullYear(this.year,this.month || 1 ,this.day || 1);
    }
    newStory.description = this.description;
    newStory.source = this.dataUrl.indexOf("assets/img/t/anne.jpg") > -1 ? "anne.jpg" : this.dataUrl;
    newStory.type = StoryType.IMAGE;
    newStory.title = this.title;
    this.storyService.addStory(this.selectedAlbum, newStory).toPromise().then(res => {
      this.navCtrl.push(StoriesPage);
    });
  }
  goBack(){
    this.step--;
  }

  goToStep2(){
    if(this.step === 0){

      this.step = 1;
    }
  }
  goToStep3(){
    if(this.step === 1){
      this.step = 2;
    }
  }
}
