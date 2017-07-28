import {NavController, NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";
import {StoryService} from "../../providers/back-end/story.service";
import {AuthService} from "../../providers/auth-service/auth-service";

@Component({
  template: `
    <ion-list>
      <ion-list-header>Meer opties</ion-list-header>
      <button ion-item (click)="deleteStory()">Verwijder dit verhaal</button>
    </ion-list>
  `
})
export class StoryOptionsComponent {
  constructor(public viewCtrl: ViewController, public storyService: StoryService,
              public authService: AuthService, public navController: NavController,
              public navParams: NavParams) {
  }

  deleteStory(): void {
    let story = this.navParams.data.story;
    this.storyService.deleteStory(+this.authService.getCurrentPatient().id, +story.id).toPromise().then(
      res => console.log(`Story with id ${story.id} deleted`)
      // TODO: give a more meanngful toast message? & handle erro
    );
    // TODO: first delete locally without needing server albums state refresh
    this.viewCtrl.dismiss("delete");

  }

  /* Unused
   close() {
   this.viewCtrl.dismiss();
   }
   */
}
