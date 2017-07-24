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
import { Dialogs } from "@ionic-native/dialogs";
import { Patient } from "../../dto/patient";


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
              public navCtrl: NavController, protected stanizerService: StanizerService,
              protected userService: PatientService, protected storyService: StoryService,
              protected dialogs: Dialogs) {
    this.stanizedYoutubeUrl = this.stanizerService.sanitize(this.youtubeUrl);
  }

  currentPatient: Patient;

  ngOnInit(): void {
    // TODO: replace with a service method
    this.currentPatient =JSON.parse(localStorage.getItem(env.temp.fakePatient)) as Patient;
  }

  ionViewWillEnter(): void {
    this.storyService.getAlbums(this.currentPatient.id).toPromise().then(albums => {
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

  getBackgroundImage(i: number): string {
    if (this.albums[i].isEmpty()) {
      return ""
    }
    else {
      /*
      let imageSrc = this.albums[i].stories[0].source;
      return "url('" + imageSrc + "')";
      */
      return this.albums[i].getBackgroundImage(0);
    }
  }

  addAlbum(): void {

    this.dialogs.prompt('Hoe wil je het album noemen?', 'Albumnaam', ['Voeg toe', 'Annuleer'])
    .then(callbackObject => {
      // "Voeg toe" clicked
      if (callbackObject.buttonIndex === 1) {
        this.storyService.addAlbum(this.currentPatient.id, callbackObject.input1).toPromise()
          .then(album => {
            console.log("Created album: " + JSON.stringify(album));
            this.albums.push(album as Album);
          })
          .catch(() => console.log("Dialog error"))
      }
    })
    .catch(e => console.log('Error displaying dialog', e));
  }
}
