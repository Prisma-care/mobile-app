import {NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";
import {StoryService} from "../../../../core/story.service";
import {PatientService} from "../../../../core/patient.service";

@Component({
  template: `
    <ion-list>
      <ion-list-header>Meer opties</ion-list-header>
      <button ion-item (click)="deleteStory()">Verwijder dit verhaal</button>
    </ion-list>
  `
})
export class StoryOptionsComponent {


  constructor(public viewCtrl: ViewController,
              public storyService: StoryService,
              public navParams: NavParams,
              private patientService: PatientService
  ) {}

  deleteStory(): void {
    let story = this.navParams.data.story;
    this.storyService.deleteStory(+this.patientService.getCurrentPatient().patient_id, +story.id).subscribe(
      () => {
        this.viewCtrl.dismiss("deleteSuccess");
      }, err => {
        this.viewCtrl.dismiss("deleteError");
      }
    )
  }
}
