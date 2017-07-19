import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";
import {StanizerService} from "../../services/stanizer.service";
import {StoryDetailsPage} from "../storydetails/storydetails";
import {PatientService} from "../../services/back-end/user.service";
import {StoryService} from "../../services/back-end/story.service";
import {NewStoryPage} from "../new-story/new-story";
import {User} from "../../dto/user";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";
import {EmptyPage} from "../empty/empty";


/* TEMPORARY IMPORT */

/**
 * More info on the slides management : https://ionicframework.com/docs/api/components/slides/Slides/
 */
@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage implements OnInit {

  public youtubeUrl: string = "www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0";
  public stanizedYoutubeUrl: any;

  user: User;

  albums: Album[];

  constructor(public actionsheetCtrl: ActionSheetController, protected camera: Camera, protected fileChooser: FileChooser,
              public navCtrl: NavController, protected stanizerService: StanizerService,
              protected userService: PatientService, protected storyService: StoryService) {
    this.stanizedYoutubeUrl = this.stanizerService.sanitize(this.youtubeUrl);
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
    this.storyService.getAlbums().toPromise().then(albums => {
      this.albums = albums as Album[];
      let empty: number = 0;
      this.albums.forEach(album => {
        if (album.stories.length > 0) empty++
      });
      if (empty === 0) {
        this.navCtrl.push(EmptyPage);
      }
    });
    this.storyService.getUserStories().toPromise().then(stories =>
      console.log("."));
  }

  getThumb(url: string, descripton?: string): string {
    if (!url)
    //return 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\' height=\'50px\' width=\'120px\'><text x=\'0\' y=\'15\' fill=\'red\' font-size=\'20\'>'+ descripton + '</text></svg>';
      return null;
    if (url.startsWith("data:image/jpeg;base64") || url.startsWith("assets"))
      return url;
    return "assets/img/t/" + url;
  }

  getStories(album: Album): UserStory[] {
    return album.stories;
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(StoryDetailsPage, {
      "album": album,
      "index": index ? index : 0
    })
  }

  showNewStory(album: Album) {
    let actionSheet = this.actionsheetCtrl.create({
        title: 'Verhaal toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Foto nemen',
            role: 'destructive ',
            icon: 'camera',
            handler: () => {

              this.camera.getPicture({
                destinationType: this.camera
                  .DestinationType.DATA_URL,
                targetWidth: 1000,
                targetHeight: 1000
              }).then((imageData) => {
                // imageData is a base64 encoded string
                let base64Image: string = "data:image/jpeg;base64," + imageData;
                this.navCtrl.push(NewStoryPage, {
                  "dateUrl": base64Image,
                  "album": album
                })
              }, (err) => {
                console.log(err);
              });

            }
          },
          {
            text: 'Foto uit album kiezen',
            role: 'destructive ',
            icon: 'image',
            handler: () => {
              this.fileChooser.open()
                .then(uri => console.log(uri))
                .catch(e => console.log(e));
            }
          },
          {
            text: 'Youtube video kiezen',
            role: 'destructive ',
            icon: 'logo-youtube',
            handler: () => {
              this.navCtrl.push(NewStoryPage, {
                "album": album
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel ',
            icon: 'md-arrow-back',
            handler: () => {
              console.log('canceled');
            }
          },
        ]

      })
    ;
    actionSheet.present();
  }
}
