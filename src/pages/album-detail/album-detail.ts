import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController, NavParams} from "ionic-angular";
import {StoryService} from "../../providers/back-end/story.service";
import {Album} from "../../dto/album";
import {UtilService} from "../../providers/util-service";
import {NewStoryPage} from "../new-story/new-story";
import {StoryDetailsPage} from "../storydetails/storydetails";
import {StanizerService} from "../../providers/stanizer.service";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AuthGuard} from "../auth-guard";
import {env} from "../../app/environment";

@Component({
  selector: 'album-detail',
  templateUrl: 'album-detail.html'
})

export class AlbumDetailPage extends AuthGuard implements OnInit {


  public album: Album;

  constructor(protected authService: AuthService, public navCtrl: NavController, public actionsheetCtrl: ActionSheetController, public utilService: UtilService, public navParams: NavParams,
              private storyService: StoryService, private sanitizer: StanizerService) {
    super(authService);
    this.album = navParams.get("album") as Album;
  }

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    if (this.album)
      this.storyService.getAlbum(this.authService.getCurrentPatient().id, this.album.id).subscribe(res => {
        this.album = res;
        console.log(JSON.stringify(this.album.stories));
      });

  }


  openActionSheet() {
    let actionSheet = this.actionsheetCtrl.create({
        title: 'Foto toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Tekst schrijven',
            role: 'destructive',
            icon: 'text',
            cssClass: 'general',
            handler: () => {
              this.navCtrl.push(NewStoryPage, {
                "album": this.album,
                "method" : env.methods.addNewStory
              });
            }
          },
          {
            text: 'Maak foto',
            role: 'destructive',
            icon: 'camera',
            cssClass: 'general',
            handler: () => {
              let pictureAttempt: Promise<any> = this.utilService.takeAPicture();

              pictureAttempt.then(
                (dataUrl) => {
                  this.navCtrl.push(NewStoryPage,
                    {
                      "dataUrl": dataUrl,
                      "album": this.album,
                      "method" : env.methods.addNewStory
                    })
                });
            }
          },
          {
            text: 'Kies foto van camerarol',
            role: 'destructive',
            icon: 'image',
            handler: () => {
              let fileChooseAttempt: Promise<any> = this.utilService.chooseAFile();

              fileChooseAttempt.then(
                (dataUrl) => {
                  this.navCtrl.push(NewStoryPage,
                    {
                      "dataUrl": dataUrl,
                      "album": this.album,
                      "method" : env.methods.addNewStory
                    })
                });
            }
          },
          {
            text: 'Annuleer',
            role: 'cancel',
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

  // DOM Sanitizer for image urls
  sanitize(i: number): any {
    let url: string = this.album.getBackgroundImage(i);
    if (!url)
      return "";
    const style = `url(${url})`;
    //console.log("Made : " + style);
    return this.sanitizer.sanitizeStyle(style);
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(StoryDetailsPage, {
      "album": album,
      "index": index ? index : 0
    })
  }

  isFavorited(i: number): boolean {
    return this.album.stories[i].favorited;
  }
}
