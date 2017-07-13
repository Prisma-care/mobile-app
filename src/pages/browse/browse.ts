import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StanizerService } from '../../services/stanizer.service';
import { StoriesPage } from "../stories/stories";
import { UserService } from "../../services/back-end/user.service";
import { StoryService } from "../../services/back-end/story.service";
import { Album } from "../../dto/album";

/**
 * More info on the slides management : https://ionicframework.com/docs/api/components/slides/Slides/
 */
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class BrowsePage extends StoriesPage implements OnInit {

  constructor(public navCtrl: NavController, protected stanizerService: StanizerService,
              protected userService: UserService, protected storyService: StoryService) {
    super(navCtrl, stanizerService, userService, storyService);
  }

  dummy(): void {
    console.log("dummy");
  }

  ngOnInit(): void {
    this.storyService.getThemes().toPromise().then(albums => {
      this.albums = albums as Album[];
    });
  }

}
