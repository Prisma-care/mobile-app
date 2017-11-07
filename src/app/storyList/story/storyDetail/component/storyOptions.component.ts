import {NavParams, ViewController} from "ionic-angular";
import {Component} from "@angular/core";
import {StoryService} from "../../../../core/story.service";
import {PatientService} from "../../../../core/patient.service";

@Component({
  selector:'prisma-story-options',
  template: `
    <ion-list class="list">
      <ion-item (click)="deleteStory()">
        <ion-icon class="trash-icon" name="md-trash"></ion-icon>
        <p class="contenu">Verwijder dit verhaal</p>
      </ion-item>
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
    this.storyService.deleteStory(+this.patientService.getCurrentPatient().patient_id, +this.navParams.data.story.id).subscribe(
      () => {
        this.viewCtrl.dismiss("deleteSuccess");
      }, err => {
        this.viewCtrl.dismiss("deleteError");
      }
    )
  }
}
