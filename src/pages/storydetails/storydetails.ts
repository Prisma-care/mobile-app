import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StoryService} from "../../services/back-end/story.service";
import {User} from "../../dto/user";
import {UserStory} from "../../dto/user-story";
import { Album  } from "../../dto/album";

@Component({
  selector: 'page-storydetails',
  templateUrl: 'storydetails.html'
})
export class StoryDetailsPage implements OnInit {
  public album: Album;
  public index: number;
  public story: UserStory;


  //Just for testing
  public likes:number=12;
  public hasLiked=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storyService: StoryService
  )  {
    this.album = navParams.get("album") as Album;
    this.index = navParams.get("index") as number;
    this.likes = this.index * 3;
  }

  ngOnInit(): void {
    this.storyService.getUserStory(this.album.stories[this.index].id)
      .toPromise()
      .then(story => this.story = story as UserStory);
  }

  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

  isValidIndex(index: number): boolean {
    return index >= 0 && index < this.album.stories.length;
  }

  addLike(){
    console.log("addigng likes");
    this.likes = this.hasLiked ? this.likes+1 : this.likes -1;
    this.hasLiked = ! this.hasLiked;
  }
}
