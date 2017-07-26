import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController, NavParams, PopoverController} from "ionic-angular";
import {StoryService} from "../../providers/back-end/story.service";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {NewStoryPage} from "../new-story/new-story";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AuthGuard} from "../auth-guard";
import {NativePageTransitions, NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import {UtilService} from "../../providers/util-service";
import {env} from "../../app/environment";
import {StanizerService} from "../../providers/stanizer.service";
import {StoryOptionsComponent} from "./story-options.component";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-storydetails',
  templateUrl: 'storydetails.html',

})
export class StoryDetailsPage extends AuthGuard implements OnInit {
  public album: Album;
  public index: number;
  public story: UserStory;

  // TODO: get favorite in backend &
  // 1 like?
  constructor(protected  authService: AuthService, public navCtrl: NavController, public navParams: NavParams,
              private storyService: StoryService, private nativePageTransitions: NativePageTransitions,
              public actionsheetCtrl:ActionSheetController, public utilService:UtilService,
              public stanizer:StanizerService, public popoverCtrl: PopoverController) {
    super(authService);
    this.album = navParams.get("album") as Album;
    this.index = navParams.get("index") as number;
  }

  ngOnInit(): void {
    if (this.navParams.get("slide")) {
      //this.navCtrl.remove(this.navCtrl.length()-2);
    }
  }
  ionViewWillEnter() {
    console.log("dajdajjda2");
    if (!this.authService.isLoggedIn()) {
      console.log("trying");
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popTo(LoginPage);
    }
    //return this.authService.isLoggedIn();
  }
  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

  isValidIndex(index: number): boolean {
    return index >= 0 && index < this.album.stories.length;
  }

  swipeEvent(e) {

    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
    };
    //swipes left
    if (e.direction == 4) {
      options.direction = 'rigth';
      this.nativePageTransitions.fade(options)
        .then(onSucess => {
        })
        .catch(err => {
        });
      this.previous();

    }

    //swipes rigth
    if (e.direction == 2) {
      options.direction = 'left';
      this.nativePageTransitions.fade(options)
        .then(onSucess => {
        })
        .catch(err => {
        });
      this.next();
    }


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
    this.album.stories[this.index].favorited = story.favorited = !this.album.stories[this.index].favorited;
    story.id = this.album.stories[this.index].id;
    this.storyService.updateStory(+this.authService.getCurrentPatient().id, story).toPromise().then(addedStory => {

    });

  }

  editDescription() {
    let story: UserStory = this.getStory();
    this.navCtrl.push(NewStoryPage, {
      "album": this.album,
      "story": story,
      "index": this.index,
      "method": env.methods.replaceDescription
    })
  }


  replaceOrAddImage() {
    let story: UserStory = this.getStory();
    let actionSheet = this.actionsheetCtrl.create({
        title: 'Foto toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
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
                      "story": story,
                      "index": this.index,
                      "method": env.methods.replaceImage
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
                      "story": story,
                      "index": this.index,
                      "method": env.methods.replaceImage
                    })
                });
            }
          },
          {
            text: 'Annuleer',
            role: 'cancel',
            icon: 'md-arrow-back',
            handler: () => {
            }
          },
        ]

      })
    ;
    actionSheet.present();
  }

  showMore(event) : void {

    let popover = this.popoverCtrl.create(StoryOptionsComponent, {
      story: this.getStory()
    });
    popover.onDidDismiss(dismissData => {
      if ((dismissData) == "delete") {
        this.navCtrl.pop(); // if the story was deleted, pop the story view
      }
    })
    popover.present({
        ev: event
    });

  }

  stanize(url:string){
    return this.stanizer.sanitize(url);
  }
  stanizeVideo(url:string){
    return this.stanizer.sanitizeVideo(url);
  }
}
