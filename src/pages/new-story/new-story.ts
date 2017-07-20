import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {Album} from "../../dto/album";
import {StoryService} from "../../services/back-end/story.service";
import {UserStory} from "../../dto/user-story";
import {StoriesPage} from "../stories/stories";
import {UtilService} from "../../services/util-service";
import {env} from "../../app/environment";

@Component({
  selector: 'page-new-story',
  templateUrl: 'new-story.html',
})
export class NewStoryPage {

  user = JSON.parse(localStorage.getItem(env.temp.fakeUser)) as Album;
  dataUrl: string;
  description: string;
  placeHolder: string = "Schrijf het verhaal.\nHoe meer details hoe beter.";

  selectedAlbum: Album;
  title: string;
  step: number = 0;

  constructor(public navCtrl: NavController, private camera: Camera, public navParams: NavParams, private storyService: StoryService, private utilService: UtilService) {
    this.dataUrl = navParams.get("dataUrl") as string;
    this.selectedAlbum = navParams.get("album") as Album;
    // check if source is a question answer
    if (navParams.get("questionAnswer")) {
      this.description = navParams.get("description");
      this.commit(); // skip to step 2 because we already have the description
    }

  }

  commit() {
    let newStory: UserStory = new UserStory();
    newStory.albumId = +this.selectedAlbum.id;
    //newStory.dateAdded = new Date();

    newStory.description = this.description;
    newStory.creatorId = +this.user.id;
    newStory.source = this.dataUrl;
    //will add the upload system
    this.storyService.addStory(3, newStory).toPromise().then(res => {
      this.navCtrl.push(StoriesPage);
    });
  }

}
