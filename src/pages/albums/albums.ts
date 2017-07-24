import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";
import {StanizerService} from "../../providers/stanizer.service";
import {PatientService} from "../../providers/back-end/user.service";
import {StoryService} from "../../providers/back-end/story.service";
import {User} from "../../dto/user";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {AlbumDetailPage} from "../album-detail/album-detail";
import {env} from "../../app/environment";


/* TEMPORARY IMPORT */


@Component({
  selector: 'albums-page',
  templateUrl: 'albums.html'
})
export class AlbumsPage implements OnInit {

  public youtubeUrl: string = "www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0";
  public stanizedYoutubeUrl: any;

  user: User = JSON.parse(localStorage.getItem(env.temp.fakeUser)) as User;

  albums: Album[];

  constructor(public actionsheetCtrl: ActionSheetController, protected camera: Camera, protected fileChooser: FileChooser,
              public navCtrl: NavController, protected sanitizer: StanizerService,
              protected userService: PatientService, protected storyService: StoryService) {
    this.stanizedYoutubeUrl = this.sanitizer.sanitize(this.youtubeUrl);
  }

  ngOnInit(): void {
    /* TESTS: to remove
     this.patientService.getPatient("12345").toPromise().then(user => {

     this.user = user;
     });

     this.storyService.getUserStories().toPromise().then(stories =>
     console.log(JSON.stringify(stories)));
     */
  }

  ionViewWillEnter(): void {
    this.storyService.getAlbums(1).toPromise().then(albums => {
      this.albums = albums as Album[];
    });
  }

  getThumb(url: string, descripton?: string): string {
    if (!url) return null;
    if (url.startsWith("data:image/jpeg;base64") || url.startsWith("assets"))
      return url;
    return "assets/img/t/" + url;
  }

  getStories(album: Album): UserStory[] {
    return album.stories;
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(AlbumDetailPage, {
      "album": album,
    })
  }

  getBackgroundImage(i: number): any {
    if (this.albums[i].isEmpty()) {
      return ""
    }
    else {
      /*
       let imageSrc = this.albums[i].stories[0].source;
       return "url('" + imageSrc + "')";
       */
      let index = this.albums[i].stories.findIndex(this.isRepresentativeOfTheAlbum);
      if (index === -1)
        index = this.albums[i].stories.findIndex(this.hasAnImage);
      if (index === -1)
        index = 0;
      const style = `background-image: url(${this.albums[i].getBackgroundImage(index)})`;
      console.log("Bg image[" + index + "] of album " + this.albums[i].title + " :" + style);
      return this.sanitizer.sanitizeStyle(style);
    }
  }

  isRepresentativeOfTheAlbum(story: UserStory): boolean {
    console.log(JSON.stringify(story) + "\n \t result : " + (!!story.source && !!story.favorited));
    return !!story.source && !!story.favorited;
  }

  hasAnImage(story: UserStory) {
    console.log(JSON.stringify(story) + "\n \t result type b : " + (!!story.source));
    return !!story.source;
  }

}
