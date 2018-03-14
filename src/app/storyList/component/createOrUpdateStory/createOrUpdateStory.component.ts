import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {Album, Story, User, Patient, Constant} from '../../../../shared/types';
import {ConstantToken} from '../../../di';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {StoryService} from '../../../core/story.service';
import {MixpanelService} from '../../../core/mixpanel.service';
import {PatientService} from '../../../core/patient.service';
import {UserService} from '../../../core/user.service';
import {StoryDetailsComponent} from '../storyDetail/storyDetail.component';
import {NavController} from 'ionic-angular/navigation/nav-controller';
import {ViewController} from 'ionic-angular/navigation/view-controller';
import {TransferObject, Transfer} from '@ionic-native/transfer';
import {LoadingController, Loading} from 'ionic-angular';
import {ToastController} from 'ionic-angular/components/toast/toast-controller';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';

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
        <!-- Add Youtube story -->
        <h2 class="plak-een-youtube-lin" *ngIf="method===constant.methods.addYoutubeStory">Plak een Youtube link om de
        video toe te voegen.</h2>
        <h2 class="plak-een-youtube-lin" *ngIf="method===constant.methods.addFileStory">Upload een foto van je toestel</h2>

        <!-- Add description story -->
        <ion-item style="padding-left: 0"></ion-item>
        <ion-item *ngIf="method !== constant.methods.addYoutubeStory">
            <ion-textarea autofocus class="story-text" placeholder="{{placeHolder}}" [(ngModel)]="story.description" rows="7"
                        clearInput></ion-textarea>
        </ion-item>
        <!-- Add Youtube Story -->
        <ion-item *ngIf="method===constant.methods.addYoutubeStory" style="padding-left: 0">
            <ion-textarea autofocus class="story-text" placeholder="{{youtubeLinkPlaceHolder}}"
            (ngModelChange)="checkYoutubeLink($event)"
            [(ngModel)]="story.source"
            rows="3" style="padding-left: 0"
            clearInput></ion-textarea>
        </ion-item>
        <!-- Add File Story -->
        <ion-item *ngIf="method===constant.methods.addFileStory" >
          <input type="file" accept=".jpg,.jpeg,.png,.gif" name="asset" #fileselector
            (change)="registerFile(fileselector.files[0])" style="padding-left: 0" />
        </ion-item>
        <ion-item>
          <ion-thumbnail class="thumbnail" style="padding-left: 7%;" *ngIf="method===constant.methods.addYoutubeStory">
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
export class CreateOrUpdateStoryComponent implements OnInit {
  file: any;
  method: string;
  dataUrl: string;
  image: SafeUrl;
  album: Album;
  story: Story;
  title = 'Vul het verhaal aan';
  assetEndpoint: string;

  placeHolder = `Schrijf het verhaal.\n Hoe meer details hoe beter.`;
  youtubeLinkPlaceHolder = 'https://www.youtube.com/watch?v=ffSnk4v3aeg';

  loading: Loading;
  isLoading: Boolean = false;
  currentPatient: Patient;
  currentUser: User;

  methods = {
    [this.constant.methods.addNewStory]: {
      init: () => {
        this.story = this.initStory({
          type: 'image'
        });
        this.isLoading = true;
      },
      send: () => {
        this.addStory().subscribe((addedStory: Story) => {
          this.uploadImage(
            this.currentPatient.patient_id,
            addedStory.id,
            this.dataUrl
          );
        });
      }
    },
    [this.constant.methods.addFileStory]: {
      init: () => {
        this.title = 'Upload een foto';
        this.story = this.initStory({
          type: 'image'
        });
        this.isLoading = true;
      },
      send: () => {
        this.addStory().subscribe((addedStory: Story) => {
          const fd = new FormData();
          fd.append('asset', this.file);
          this.loading = this.loadingCtrl.create({
            content: 'Uploading...'
          });
          this.loading.present();
          this.storyService
            .addFile(this.currentPatient.patient_id, addedStory.id, fd)
            .subscribe(() => {
              this.loading.dismissAll();
              this.navCtrl.pop();
            });
        });
      }
    },
    [this.constant.methods.addYoutubeStory]: {
      init: () => {
        this.title = 'Kies video van Youtube';
        this.story = this.initStory({
          type: 'youtube',
          description: 'Video van Youtube'
        });
      },
      send: () => {
        if (this.isLoading) {
          this.addStory()
            .pipe(
              map((addedStory: Story) =>
                this.storyService.addYoutubeLinkAsset(
                  this.currentPatient.patient_id,
                  addedStory.id,
                  this.story.source
                )
              ),
              switchMap((x: Observable<Object | Error>) => x)
            )
            .subscribe(() => this.navCtrl.pop());
        } else {
          this.toastCtrl
            .create({
              message: 'Bad youtube link',
              duration: 3000,
              position: 'bottom'
            })
            .present();
        }
      }
    },
    [this.constant.methods.replaceDescription]: {
      init: () => {
        this.isLoading = true;
      },
      send: () => {
        this.updateDescription();
      }
    }
  };

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private navParams: NavParams,
    private sanitizer: DomSanitizer,
    private storyService: StoryService,
    private mixpanel: MixpanelService,
    private patientService: PatientService,
    private userService: UserService,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private transfer: Transfer,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private changeDetect: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.method = this.navParams.get('method');
    this.dataUrl = this.navParams.get('dataUrl');
    this.album = this.navParams.get('album') as Album;
    this.story = {...this.navParams.get('story')} as Story;
    this.currentPatient = this.patientService.getCurrentPatient();
    this.currentUser = this.userService.getCurrentUser();
    this.methods[this.method].init();
  }

  commit() {
    this.methods[this.method].send();
  }

  updateDescription() {
    this.storyService
      .updateStory(this.currentPatient.patient_id, this.story)
      .subscribe(() => {
        this.mixpanel.track('NewStoryComponent::updateDescription', {
          email: this.currentUser.email,
          patient_id: this.currentPatient.patient_id,
          updatedStory: this.story,
          selectedAlbum: this.album
        });

        this.navCtrl.push(StoryDetailsComponent, {
          album: this.album,
          story: this.story
        });

        this.navCtrl.remove(this.viewCtrl.index - 1, 2);
      });
  }

  initStory(params) {
    return {
      ...this.story,
      ...params,
      albumId: this.album.id,
      creatorId: this.currentUser.id
    };
  }

  addStory() {
    return this.storyService
      .addStory(this.currentPatient.patient_id, this.story)
      .pipe(
        map((addedStory: Story) => {
          this.mixpanel.track('NewStoryComponent::saving story', {
            email: this.currentUser.email,
            patient_id: this.currentPatient.patient_id,
            newStory: this.story,
            selectedAlbum: this.album
          });
          return addedStory;
        })
      );
  }

  checkYoutubeLink(value) {
    this.storyService
      .checkYoutubeLink(value)
      .subscribe((res: {thumbnail: string; description: string}) => {
        if (res) {
          this.image = this.sanitizer.bypassSecurityTrustUrl(res.thumbnail);
          this.story = {...this.story, description: res.description};
          this.isLoading = true;
        } else {
          this.image = '';
          this.isLoading = false;
        }
      });
  }

  registerFile(file) {
    this.file = file;
  }

  private getAssetEndpoint(storyId: number, patientId: number): string {
    return `${this.constant.apiUrl}/${
      this.constant.api.getPatient
    }/${patientId}/${this.constant.api.getStory}/${storyId}/${
      this.constant.api.getAsset
    }`;
  }

  uploadImage(patientId: number, storyId: number, lastImage: string) {
    const url = this.getAssetEndpoint(storyId, patientId);
    const options = {
      fileKey: 'asset',
      fileName: 'asset',
      mimeType: 'image/jpeg',
      headers: {
        Connection: 'close',
        Authorization: 'Bearer ' + localStorage.getItem(this.constant.jwtToken)
      }
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });
    this.loading.present();
    const targetPath = lastImage;

    fileTransfer.upload(targetPath, url, options).then(
      () => {
        this.loading.dismissAll();
        this.navCtrl.pop();
      },
      () => {
        this.loading.dismissAll();
        this.navCtrl.pop();
      }
    );
  }
}
