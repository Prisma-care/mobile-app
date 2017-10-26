import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController, NavParams} from "ionic-angular";
import {Album} from "../../dto/album";
import {UtilService} from "../../providers/util-service";
import {NewStoryPage} from "../new-story/new-story";
import {StoryDetailsPage} from "../storydetails/storydetails";
import {StanizerService} from "../../providers/stanizer.service";
import {AuthenticationService} from "../../app/core/authentication.service";
import {AuthGuard} from "../auth-guard";
import {env} from "../../app/environment";
import {TranslatorService} from "../../providers/translator.service";
import {UserStory} from "../../dto/user-story";
import {PatientService} from "../../app/core/patient.service";
import {AlbumService} from "../../app/core/album.service";

@Component({
  selector: 'album-detail',
  templateUrl: 'album-detail.html'
})

export class AlbumDetailPage  implements OnInit {


  public album: Album;
  backgroundImages: any[] = [];

  public loadingImageStyle: any = `background-image: url(${env.loadingImage})`;

  constructor(protected authService: AuthenticationService,
              public patientService: PatientService,
              public navCtrl: NavController,
              public translatorService: TranslatorService,
              public actionsheetCtrl: ActionSheetController,
              public utilService: UtilService,
              public navParams: NavParams,
              private sanitizer: StanizerService,
              private ref: ChangeDetectorRef,
              private  albumService:AlbumService) {
    this.album = navParams.get("album") as Album;
    this.orderByFavorited();
    this.loadingImageStyle = this.sanitizer.sanitizeStyle(this.loadingImageStyle);
  }

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    this.albumService.getAlbum(this.patientService.getCurrentPatient().patient_id, this.album.id).subscribe(res => {
      this.album = res as Album;
      this.orderByFavorited();
      console.log('album',this.album);
      if (this.album) {
        let i: number = 0;
        this.album.stories.forEach(story => {
          if (!this.imageLoaded(i))
            this.setBackgroundImages(i);
          i++;
        })

        console.log('backgroundImages',this.backgroundImages)
      }
    });
  }

  orderByFavorited() {
    if(!this.album)
      return;

    const favorites= this.album.stories.filter((storie:UserStory)=>storie.favorited);
    const notFavorites= this.album.stories.filter((storie:UserStory)=>!storie.favorited);
    this.album.stories = favorites.concat(notFavorites);
  }

  openActionSheet() {
    let text1: string = 'Tekst schrijven';
    let text2: string = 'Maak foto';
    let text3: string = 'Kies foto van camerarol';
    let text4: string = 'Kies video van Youtube';
    let text5: string = 'Annuleer';
    this.translatorService.translate(text1, value => text1 = value);
    this.translatorService.translate(text2, value => text2 = value);
    this.translatorService.translate(text3, value => text3 = value);
    this.translatorService.translate(text4, value => text4 = value);
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
                  console.log("Data Url : " + dataUrl)
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
  setBackgroundImages(i: number) {
    let url: string = this.album.getBackgroundImage(i);
    if (!url) {
      this.album.stories[i].backgroundImage = "";
      this.ref.markForCheck();
      return;
    }
    let thumb = this.getThumb(url);
    this.album.stories[i].backgroundImage = this.loadingImageStyle;
    if (thumb.indexOf(env.privateImagesRegex) < 0) {
      const style = `background-image: url(${thumb})`;
      this.album.stories[i].backgroundImage = this.sanitizer.sanitizeStyle(style);
      this.ref.markForCheck();
      return;
    }
    this.albumService.getImage(thumb).toPromise().then(blob => {
      const style2 = `background-image: url(${blob})`;
      this.album.stories[i].backgroundImage = this.sanitizer.sanitizeStyle(style2);
      this.ref.markForCheck();
      return;
    });
  }

  getBackgroundImg(i: number): any {
    return this.album.stories[i].backgroundImage;
  }

  isAVideoBackground(i: number): boolean {
    let url: string = this.album.getBackgroundImage(i);
    if (!url)
      return false;
    url = this.getThumb(url);
    return url.toLowerCase().indexOf("img.youtube") >= 0;
  }

  showDetails(album: Album, story: UserStory) {
    const storyWithoutBackgourndImage={
      ...story,
      backgroundImage:null
    };

    this.navCtrl.push(StoryDetailsPage, {
      "album": album,
      "story":storyWithoutBackgourndImage
    })
  }

  isFavorited(i: number): boolean {
    return this.album.stories[i].favorited;
  }

  getThumb(url: string) {
    return this.utilService.getThumb(url);
  }

  noImage(index: number): boolean {
    return this.album.stories[index].backgroundImage === "";
  }

  imageLoaded(index: number): boolean {
    return !!this.album.stories[index].backgroundImage && this.album.stories[index].backgroundImage != this.loadingImageStyle;
  }
}
