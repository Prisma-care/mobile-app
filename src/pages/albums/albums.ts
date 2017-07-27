import {Component, OnInit} from "@angular/core";
import {ActionSheetController, AlertController, MenuController, NavController} from "ionic-angular";
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
import {Patient} from "../../dto/patient";
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";
import {TranslatorService} from "../../providers/translator.service";


/* TEMPORARY IMPORT */


@Component({
  selector: 'albums-page',
  templateUrl: 'albums.html'
})
export class AlbumsPage extends AuthGuard implements OnInit {


  user: User = JSON.parse(localStorage.getItem(env.temp.fakeUser)) as User;

  albums: Album[];

  constructor(public authService: AuthService, public navCtrl: NavController,public translatorService: TranslatorService, public actionsheetCtrl: ActionSheetController, protected camera: Camera, protected fileChooser: FileChooser,
              protected sanitizer: StanizerService,
              protected patientService: PatientService, protected storyService: StoryService,
              protected alertCtrl: AlertController, menu: MenuController) {
    super(authService, navCtrl, translatorService);
    this.currentPatient = this.authService.getCurrentPatient();
    menu.enable(true);
  }

  currentPatient: Patient;

  ngOnInit(): void {
    // TODO: replace with a service method
    this.currentPatient = this.authService.getCurrentPatient();
  }

  ionViewWillEnter(): void {
    console.log("Test : " + JSON.stringify(this.authService.getCurrentPatient()));
    this.storyService.getAlbums(this.authService.getCurrentPatient().id).toPromise().then(albums => {
      this.albums = albums as Album[];
    });
  }


  getStories(album: Album): UserStory[] {
    return album.stories;
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(AlbumDetailPage, {
      "album": album,
    })
  }

  /*
   private colors: any = {
   "yellow": "#FAD820",
   "orange": "#FF9F00",
   "red": "#F35A4B",
   "purple": "#D95DB4",
   "blue": "#637DC8"
   };
   */

  private colorCodes: string[] = ["#FAD820", "#FF9F00", "#F35A4B", "#D95DB4", "#637DC8"];

  getBackgroundColor(i: number): string {
    if (this.albums[i].isEmpty()) {
      let currentColor: string = this.colorCodes[i % this.colorCodes.length];
      return currentColor;
    }
    else {
      return "";
    }
  }

  getBackgroundImage(i: number): any {
    if (this.albums[i].isEmpty()) {
      return "";
    }
    else {
      let index = this.albums[i].stories.findIndex(this.isRepresentativeOfTheAlbum);
      if (index === -1)
        index = this.albums[i].stories.findIndex(this.hasAnImage);
      if (index === -1)
        index = 0;
      let thumb: string = this.getThumb(this.albums[i].getBackgroundImage(index));
      const style = `background-image: url(${thumb})`;
      if (!this.albums[i].getBackgroundImage(index))
        return "";
      return this.sanitizer.sanitizeStyle(style);
    }
  }

  isAVideoBackground(i: number): boolean {
    if (this.albums[i].isEmpty()) {
      return false;
    }
    else {
      let index = this.albums[i].stories.findIndex(this.isRepresentativeOfTheAlbum);
      if (index === -1)
        index = this.albums[i].stories.findIndex(this.hasAnImage);
      if (index === -1)
        index = 0;
      let thumb: string = this.getThumb(this.albums[i].getBackgroundImage(index));
      const style = `background-image: url(${thumb})`;
      if (!this.albums[i].getBackgroundImage(index))
        return false;
      return thumb.toLowerCase().indexOf("img.youtube") >= 0;
    }
  }

  addAlbum(): void {

    let albumFailedAlert = this.alertCtrl.create({
      title: 'Fout bij het maken van het album',
      subTitle: 'Onze excuses, het album kon niet aangemaakt worden. Er is iets fout met Prisma.\nProbeer later nog eens opnieuw!',
      buttons: ['Ok']
    });

    this.alertCtrl.create({
      "title": 'Voeg album toe',
      "message": 'Hoe wil je het album noemen?',
      inputs: [
        {
          name: 'title',
          placeholder: 'bv. Kajakclub'
        },
      ],
      buttons: [
        {
          text: 'Annuleer',
          handler: data => {
          }
        },
        {
          text: 'Voeg toe',
          handler: data => {
            this.storyService.addAlbum(this.currentPatient.id, data.title).toPromise()
              .then(album => {

                //this.albums.push(album as Album);
                // TODO: this would spare us a whole refresh
                // but it gives errors

                // complete albums refresh
                this.ionViewWillEnter()
              })
              .catch(() => albumFailedAlert.present());
          }
        }
      ]
    }).present();
  }

  isRepresentativeOfTheAlbum(story: UserStory): boolean {
    return !!story.source && !!story.favorited;
  }

  hasAnImage(story: UserStory) {
    return !!story.source;
  }


  getThumb(url: string) {
    if (url.toLowerCase().indexOf("youtube.com") >= 0) {
      var reg = /embed\/(.+?)\?/;
      let video = url.match(reg)[1];
      let thumbailLink = "http://img.youtube.com/vi/" + video + "/0.jpg";
      return thumbailLink;
    } else {
      return url;
    }
  }
}
