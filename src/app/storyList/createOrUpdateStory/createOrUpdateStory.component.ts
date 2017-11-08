import { Component, OnInit, Inject } from "@angular/core";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { Album } from "../../../dto/album";
import { UserStory } from "../../../dto/user-story";
import { EnvironmentToken, Environment } from "../../environment";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { StoryService } from "../../core/story.service";
import { Analytics } from "../../../providers/analytics";
import { PatientService } from "../../core/patient.service";
import { UserService } from "../../core/user.service";
import { StoryDetailsPage } from "../story/storyDetail/storyDetail.component";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { TransferObject, Transfer } from "@ionic-native/transfer";
import { LoadingController, Loading } from "ionic-angular";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { Patient } from "../../../dto/patient";
import { User } from "../../../dto/user";

@Component({
  selector: 'prisma-create-update-story',
  template: `
    <ion-header>
    <ion-navbar>
        <ion-title>{{title}}</ion-title>
    </ion-navbar>
    </ion-header>

    <ion-content padding>
    <ion-item-group>
        <br>
        <h2 class="plak-een-youtube-lin" *ngIf="method===env.methods.addYoutubeStory">Plak een Youtube link om de
        video toe te voegen.</h2>

        <ion-item style="padding-left: 0">
        <ion-item *ngIf="method !== env.methods.addYoutubeStory">
            <ion-textarea autofocus class="story-text" placeholder="{{placeHolder}}" [(ngModel)]="story.description" rows="7"
                        clearInput></ion-textarea>
        </ion-item>
        <ion-item *ngIf="method===env.methods.addYoutubeStory" style="padding-left: 0">
            <ion-textarea autofocus class="story-text" placeholder="{{youtubeLinkPlaceHolder}}" (ngModelChange)="checkYoutubeLink($event)" [(ngModel)]="story.source" rows="3" style="padding-left: 0"
                        clearInput></ion-textarea>
        </ion-item>
          <ion-thumbnail class="thumbnail" style="padding-left: 7%;">
              <img *ngIf="isLoading" [src]="image">
              <ion-spinner *ngIf="!isLoading" item-start name="dots" color="grey"></ion-spinner>
          </ion-thumbnail>
        </ion-item>

        <button ion-button solid block full large color="primary" (click)="commit()"
          [disabled]="!isLoading">
          <ion-icon name="checkmark"></ion-icon>
        </button>

    </ion-item-group>
    </ion-content>

  `
})


export class createOrUpdateStoryPage implements OnInit {

  method: string;
  dataUrl: string;
  image: SafeUrl;
  album: Album;
  story: UserStory;
  title: string = 'Vul het verhaal aan';

  placeHolder: string = "Schrijf het verhaal.\nHoe meer details hoe beter.";
  youtubeLinkPlaceHolder: string = "https://www.youtube.com/watch?v=ffSnk4v3aeg";

  loading: Loading;
  isLoading: Boolean = false
  currentPatient: Patient;
  currentUser: User;

  methods = {
    [this.env.methods.addNewStory]: {
      init: () => {
        this.story = this.initStory({
          type:'image'
        })
        this.image = this.storyService.pathForImage(this.dataUrl)
        this.isLoading = true;
      },
      send: () => {
        this.addStory().subscribe((addedStory) => {
          this.uploadImage(+this.currentPatient.patient_id, +addedStory.id, this.dataUrl)
        })
      }
    },
    [this.env.methods.addYoutubeStory]: {
      init: () => {
        this.title = 'Kies video van Youtube';
        this.story = this.initStory({
          type: 'youtube',
          description: 'Video van Youtube'
        })
      },
      send: () => {
        if (this.isLoading) {
          this.addStory()
            .map((addedStory) => this.storyService.addYoutubeLinkAsset(+this.currentPatient.patient_id, +addedStory.id, this.story.source))
            .switchMap(x => x)
            .subscribe(() => this.navCtrl.pop())
        } else {
          this.toastCtrl.create({
            message: 'Bad youtube link',
            duration: 3000,
            position: 'bottom'
          }).present()
        }
      }
    },
    [this.env.methods.replaceDescription]: {
      init: () => {
        this.image = this.sanitizer.bypassSecurityTrustUrl(this.dataUrl)
        this.isLoading = true;
      },
      send: () => {
        this.updateDescription()
      }
    }
  }

  constructor( @Inject(EnvironmentToken) private env: Environment,
    private navParams: NavParams,
    private sanitizer: DomSanitizer,
    private storyService: StoryService,
    private analytics: Analytics,
    private patientService: PatientService,
    private userService: UserService,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private transfer: Transfer,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  ngOnInit(): void {

    this.method = this.navParams.get("method");
    this.dataUrl = this.navParams.get("dataUrl");
    this.album = this.navParams.get("album") as Album;
    this.story = { ...this.navParams.get("story") } as UserStory;
    this.currentPatient = this.patientService.getCurrentPatient();
    this.currentUser = this.userService.getCurrentUser()
    this.methods[this.method].init();
  }

  commit() {
    this.methods[this.method].send()
  }

  updateDescription() {
    this.storyService.updateStory(+this.currentPatient.patient_id, this.story).subscribe(addedStory => {

      this.analytics.track('NewStoryComponent::updateDescription', {
        email: this.currentUser.email,
        patient_id: +this.currentPatient.patient_id,
        updatedStory: this.story,
        selectedAlbum: this.album
      });

      this.navCtrl.push(StoryDetailsPage, {
        "album": this.album,
        "story": this.story,
      });

      this.navCtrl.remove(this.viewCtrl.index - 1, 2)
    });
  }

  initStory(params) {
    return {
      ...this.story,
      ...params,
      albumId: +this.album.id,
      creatorId: +this.currentUser.id
    }
  }

  addStory() {
    return this.storyService.addStory(+this.currentPatient.patient_id, this.story).map((addedStory: UserStory) => {
      this.analytics.track('NewStoryComponent::saving story', {
        email: this.currentUser.email,
        patient_id: +this.currentPatient.patient_id,
        newStory: this.story,
        selectedAlbum: this.album
      });
      return addedStory;
    })
  }

  checkYoutubeLink(value) {
    this.storyService.checkYoutubeLink(value)
      .subscribe((res:string) => {
        if (res) {
          this.image = this.sanitizer.bypassSecurityTrustUrl(res)
          this.isLoading = true;
        } else {
          this.image = ''
          this.isLoading = false;
        }
      })
  }

  uploadImage(patientId: number, storyId: number, lastImage: string) {

    const url = `${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}/${this.env.api.getAsset}`;

    const options = {
      fileKey: "asset",
      fileName: "asset",
      mimeType: "image/jpeg",
      headers: {
        "Connection": "close",
        "Authorization": "Bearer " + localStorage.getItem(this.env.jwtToken)
      }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
    const targetPath = this.storyService.pathForImage(lastImage);

    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll();
      this.navCtrl.pop();
    }, err => {
      this.loading.dismissAll()
      this.navCtrl.pop();
    });
  }
}
