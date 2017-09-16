import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {ActionSheetController, MenuController, NavController, NavParams, PopoverController} from "ionic-angular";
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
import {TranslatorService} from "../../providers/translator.service";

@Component({
  selector: 'page-storydetails',
  templateUrl: 'storydetails.html',

})
export class StoryDetailsPage extends AuthGuard implements OnInit {
  public album: Album;
  public index: number;
  public story: UserStory;

  public loadingImageUrl: string = env.loadingImage;

  public backgroundImages: any[] = [];
  // TODO: get favorite in backend &
  // 1 like?
  constructor(protected  authService: AuthService, public navCtrl: NavController, public translatorService: TranslatorService, public navParams: NavParams,
              private storyService: StoryService, private nativePageTransitions: NativePageTransitions,
              public actionsheetCtrl: ActionSheetController, public utilService: UtilService,
              public stanizer: StanizerService, public popoverCtrl: PopoverController, public menu: MenuController, private ref: ChangeDetectorRef) {
    super(authService, navCtrl, translatorService);
    this.album = navParams.get("album") as Album;
    this.story = navParams.get("story") as UserStory;
    this.index = navParams.get("index") as number;

  }

  ngOnInit(): void {
    if (this.navParams.get("slide")) {
      //this.navCtrl.remove(this.navCtrl.length()-2);
    }
  }

  ionViewWillEnter() {
    if (this.album)
      this.storyService.getAlbum(this.authService.getCurrentPatient().patient_id, this.album.id).toPromise().then(res => {
        this.album = res;
        if (!this.imageLoaded(this.findIndexStory(this.story)))
          this.setStanizedUrl(this.story.source, this.index);
      });
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
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

      this.previous();

    }

    //swipes rigth
    if (e.direction == 2) {
      options.direction = 'left';

      this.next();
    }


  }

  next(): void {
    this.index = (this.findIndexStory(this.story) + 1) % this.album.stories.length;
    this.story= this.album.stories[this.index];

    if (!this.imageLoaded(this.index))
      this.setStanizedUrl(this.story.source, this.index);
  }

  findIndexStory(story:UserStory):number{
    return this.album.stories.findIndex((s:UserStory)=>{
      return s.id===story.id;
    });
  }
  previous(): void {

    this.index =this.findIndexStory(this.story) === 0 ? this.album.stories.length - 1 : this.index - 1;
    this.story= this.album.stories[this.index];

    if (!this.imageLoaded(this.index))
      this.setStanizedUrl(this.story.source, this.index);
  }

  isFavorited(): boolean {
    return this.getStory().favorited;
  }

  toggleFavorite(): void {
    // this.getStory().favorited = this.getStory().favorited ? false : true;
    //this.story.user

    this.story.favorited= !this.story.favorited;
    this.storyService.updateStory(+this.authService.getCurrentPatient().patient_id,this.story).toPromise().then(addedStory => {

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

  showMore(event): void {

    let popover = this.popoverCtrl.create(StoryOptionsComponent, {
      story: this.getStory()
    });
    popover.onDidDismiss(dismissData => {
      if ((dismissData) == "delete") {
        this.navCtrl.pop(); // if the story was deleted, pop the story view
      }
    });
    popover.present({
      ev: event
    });

  }

  async setStanizedUrl(url: string, i: number) {
    if (!url) {
      return;
    }
    if (url.indexOf(env.privateImagesRegex) < 0) {
      this.story.backgroundImage = this.stanizer.sanitize(url);
      this.album.stories[i]=this.story;
      this.ref.markForCheck();
      return;
    }


    await this.storyService.getImage(url).toPromise().then(blob => {
      this.story.backgroundImage = this.stanizer.sanitize(blob);
      this.album.stories[i]=this.story;
      this.ref.markForCheck();
      return;
    })
  }

  getStanizedUrl() {
    return this.story.backgroundImage;
  }

  stanizeVideo(url: string) {
    return this.stanizer.sanitizeVideo("https://www.youtube.com/embed/" + this.utilService.getYoutubeId(url) + "?rel=0" +
      "&amp;autoplay=1" +
      "&amp;showinfo=0");
  }

  imageLoaded(index: number): boolean {
    return !!this.story.backgroundImage && this.story.backgroundImage != this.loadingImageUrl;
  }

  private getStory(): UserStory {
    return this.story;
  }
}
