import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {StoryService} from "../../services/back-end/story.service";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {StoriesPage} from "../stories/stories";

@Component({
  selector: 'album-detail',
  templateUrl: 'album-detail.html'
})

export class AlbumDetailPage implements OnInit {
  public album: Album;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storyService: StoryService) {
    this.album = navParams.get("album") as Album;
  }

  ngOnInit(): void {
    /*
    TODO!!
    this.storyService.getUserStory(this.album.stories[this.index].id)
      .toPromise()
      .then(story => this.story = story as UserStory);
    if (this.navParams.get("slide")) {
      //this.navCtrl.remove(this.navCtrl.length()-2);
    }
    */
  }

  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

}
