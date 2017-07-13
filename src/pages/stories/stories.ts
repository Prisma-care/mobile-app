import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { StanizerService } from '../../services/stanizer.service';
import {StoryDetailsPage} from "../storydetails/storydetails";
import {UserService} from "../../services/back-end/user.service";
import {StoryService} from "../../services/back-end/story.service";
import {NewStoryPage} from "../new-story/new-story";
import {User} from "../../dto/user";
import {UserStory} from "../../dto/user-story";
import { Album  } from "../../dto/album";


/* TEMPORARY IMPORT */

/**
 * More info on the slides management : https://ionicframework.com/docs/api/components/slides/Slides/
 */
@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage implements OnInit {

  // TODO : remove or do something with this
  public youtubeUrl:string = "www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0";
  public stanizedYoutubeUrl:any;

  user: User;

  albums: Album[];

  constructor(public navCtrl: NavController, protected stanizerService: StanizerService,
              protected userService: UserService, protected storyService: StoryService) {
      this.stanizedYoutubeUrl = this.stanizerService.sanitize(this.youtubeUrl);
  }

  ngOnInit(): void {
    /* TESTS: to remove
    this.userService.getUser("12345").toPromise().then(user => {

        this.user = user
        console.log("Final user : " + JSON.stringify(this.user));
      });

    this.storyService.getUserStories().toPromise().then(stories =>
    console.log(JSON.stringify(stories)));
    */

    this.storyService.getAlbums().toPromise().then(albums => {
      this.albums = albums as Album[];
    });
  }

  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

  getStories(album: Album) : UserStory[] {
    return album.stories.slice(0,4);
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(StoryDetailsPage, {
      "album": album,
      "index": index ? index : 0
    })
  }

  showNewStory() {
    this.navCtrl.push(NewStoryPage, {dataUrl: ""});
  }
}
