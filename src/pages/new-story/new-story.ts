import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

   dataUrl:string="assets/img/t/anne.jpg";
   albums:Album[]=[];
   selectedAlbum:Album;
   description:string;
    title:string;

  constructor(public navCtrl: NavController,private camera: Camera, public navParams: NavParams,private storyService: StoryService) {
    this.dataUrl = navParams.get("dateUrl") as string;
    if(!this.dataUrl)
      this.dataUrl ="assets/img/t/anne.jpg";
    this.selectedAlbum = navParams.get("album") as Album;
    if(!this.selectedAlbum)
      this.selectedAlbum = new Album();
    this.storyService.getAlbums().toPromise().then(albums => {
      this.albums = albums as Album[];
    });
  }
  commit(){
    let newStory:UserStory = new UserStory();
    newStory.albumId = this.selectedAlbum.id;
    newStory.dateAdded = new Date();
    newStory.description = this.description;
    newStory.source = this.dataUrl;
    newStory.type = StoryType.IMAGE;
    newStory.title = this.title;
    this.storyService.addStory(this.selectedAlbum,newStory).toPromise().then(res => {
      this.navCtrl.push(StoriesPage);
    });
  }
}
