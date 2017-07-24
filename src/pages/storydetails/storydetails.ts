import {Component, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {StoryService} from "../../providers/back-end/story.service";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {NewStoryPage} from "../new-story/new-story";
import {AuthService} from "../../providers/auth-service/auth-service";

@Component({
  selector: 'page-storydetails',
  templateUrl: 'storydetails.html'
})
export class StoryDetailsPage implements OnInit {
  public album: Album;
  public index: number;
  public story: UserStory;

  // TODO: get favorite in backend &
  // 1 like?
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storyService: StoryService, public authService: AuthService) {
    this.album = navParams.get("album") as Album;
    this.index = navParams.get("index") as number;
  }

  ngOnInit(): void {
    if (this.navParams.get("slide")) {
      //this.navCtrl.remove(this.navCtrl.length()-2);
    }
  }

  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

  isValidIndex(index: number): boolean {
    return index >= 0 && index < this.album.stories.length;
  }

  swipeEvent(e) {
    //swipes left
    if (e.direction == 4)
      this.previous();
    //swipes rigth
    if (e.direction == 2)
      this.next();
  }

  next(): void {
    this.index = (this.index + 1) % this.album.stories.length;
  }

  previous(): void {
    this.index = this.index === 0 ? this.album.stories.length - 1 : this.index - 1;
  }

  private getStory(): UserStory {
    return this.album.stories[this.index];
  }

  isFavorited(): boolean {
    return this.getStory().favorited;
  }

  toggleFavorite(): void {
    // this.getStory().favorited = this.getStory().favorited ? false : true;
    //this.album.stories[this.index].user

    let story: UserStory = new UserStory();
    story.favorited = this.album.stories[this.index].favorited ? false : true;
    story.id = this.album.stories[this.index].id;
    this.storyService.updateStory(+this.authService.getCurrentPatient().id, story).toPromise().then(addedStory => {
      this.album.stories[this.index] = addedStory;
    });

  }

  editDescription() {
    let story: UserStory = this.getStory();
    this.navCtrl.push(NewStoryPage, {
      "album": this.album,
      "story": story,
      "index": this.index
    })
  }
}
