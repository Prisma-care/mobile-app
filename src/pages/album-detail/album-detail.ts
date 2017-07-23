import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController, NavParams} from "ionic-angular";
import {StoryService} from "../../providers/back-end/story.service";
import {Album} from "../../dto/album";
import {UtilService} from "../../providers/util-service";
import {NewStoryPage} from "../new-story/new-story";
import {StoriesPage} from "../stories/stories";
import { StoryDetailsPage } from "../storydetails/storydetails";
import { DomSanitizer } from "@angular/platform-browser/platform-browser";
import { StanizerService } from "../../providers/stanizer.service";

@Component({
  selector: 'album-detail',
  templateUrl: 'album-detail.html'
})

export class AlbumDetailPage implements OnInit {
  public album: Album;

  constructor(public navCtrl: NavController, public actionsheetCtrl: ActionSheetController, public utilService: UtilService, public navParams: NavParams,
              private storyService: StoryService, private sanitizer: StanizerService) {
    this.album = navParams.get("album") as Album;
  }

  ngOnInit(): void {
    /*
     TODO!!
     this.storyService.getUserStory(this.album.stories[this.index].id)
     .toPromise()
     .then(story => this.story = story as UserStory);
     if (this.navParams.get("slide")) {
     //this.navCtrl.remove(this.navCtrl.length()-2);
     }
     */
  }


  getThumb(url: string): string {
    return "" + url;
  }

  openActionSheet() {
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
                      "album": this.album
                    })
                });

              //this.utilService.showErrorMessage("DataURl : " +  infos.dataUrl + "\n" + infos.error);

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
                      "album": this.album
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
  sanitize(url): any {
    console.log("sanitize attempt: " + url);
    const style = `background-image: url(${url})`;
    console.log(style);
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
