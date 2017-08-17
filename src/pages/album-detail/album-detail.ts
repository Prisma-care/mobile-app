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
import {TranslatorService} from "../../providers/translator.service";

@Component({
  selector: 'album-detail',
  templateUrl: 'album-detail.html'
})

export class AlbumDetailPage extends AuthGuard implements OnInit {


  public album: Album;

  constructor(protected authService: AuthService, public navCtrl: NavController,public translatorService: TranslatorService,
              public actionsheetCtrl: ActionSheetController, public utilService: UtilService, public navParams: NavParams,
              private storyService: StoryService, private sanitizer: StanizerService) {
    super(authService, navCtrl,translatorService);
    this.album = navParams.get("album") as Album;
  }

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    if (this.album)
      this.storyService.getAlbum(this.authService.getCurrentPatient().id, this.album.id).subscribe(res => {
        this.album = res;
      });
  }


  openActionSheet() {
    let text1:string = 'Tekst schrijven';
    let text2:string = 'Maak foto';
    let text3:string = 'Kies foto van camerarol';
    let text4:string = 'Kies video van Youtube';
    let text5:string = 'Annuleer';
    this.translatorService.translate(text1, value => text1 = value);
    this.translatorService.translate(text2, value => text2 = value);
    this.translatorService.translate(text3, value => text3 = value);
    this.translatorService.translate(text4, value => text4= value);
    this.translatorService.translate(text5, value => text5 = value);

    let actionSheet = this.actionsheetCtrl.create({
        title: 'Foto toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: text1,
            role: 'destructive',
            icon: 'text',
            cssClass: 'general',
            handler: () => {
              this.navCtrl.push(NewStoryPage, {
                "album": this.album,
                "method": env.methods.addNewStory
              });
            }
          },
          {
            text: text2,
            role: 'destructive',
            icon: 'camera',
            cssClass: 'general',
            handler: () => {
              let pictureAttempt: Promise<any> = this.utilService.takeAPicture();

              pictureAttempt.then(
                (dataUrl) => {
                  if (dataUrl)
                    this.navCtrl.push(NewStoryPage,
                      {
                        "dataUrl": dataUrl,
                        "album": this.album,
                        "method": env.methods.addNewStory
                      })
                });
            }
          },
          {
            text: text3,
            role: 'destructive',
            icon: 'image',
            handler: () => {
              let fileChooseAttempt: Promise<any> = this.utilService.chooseAFile();

              fileChooseAttempt.then(
                (dataUrl) => {
                  if (dataUrl)
                    this.navCtrl.push(NewStoryPage,
                      {
                        "dataUrl": dataUrl,
                        "album": this.album,
                        "method": env.methods.addNewStory
                      })
                });
            }
          },
          {
            text: text4,
            role: 'destructive',
            icon: 'play',
            handler: () => {
              this.navCtrl.push(NewStoryPage,
                {
                  "album": this.album,
                  "method": env.methods.addYoutubeStory
                });
            }
          },
          {
            text: text5,
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
    url = this.getThumb(url);
    const style = `url(${url})`;
    //console.log("Made : " + style);
    return this.sanitizer.sanitizeStyle(style);
  }


  isAVideoBackground(i: number): boolean {
    let url: string = this.album.getBackgroundImage(i);
    if (!url)
      return false;
    url = this.getThumb(url);
    //console.log("Made : " + style);
    return url.toLowerCase().indexOf("img.youtube") >= 0;
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
