import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TutorialPage} from "../tutorial/tutorial";
import {PatientService} from "../../services/back-end/user.service";
import {Patient} from "../../dto/patient";
import {StoryService} from "../../services/back-end/story.service";
import {Album} from "../../dto/album";

@Component({
  selector: 'page-api-testing',
  templateUrl: 'api-testing.html',
})
export class ApiTestingPage {

  public patientToAdd: Patient = new Patient();
  public patientAdded: Patient = new Patient();
  public patientAddedAlbums: Album[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientService, public storySerivce: StoryService) {

  }

  ionViewDidLoad() {
    this.patientService.getPatient("3").toPromise().then(res => {
      this.patientAdded = res;
    })
    this.storySerivce.getAlbums(this.patientAdded.id).toPromise().then(res => this.patientAddedAlbums = res);
  }

  backToTuto() {
    this.navCtrl.push(TutorialPage);
  }

  addUser() {
    this.patientService.addPatient(this.patientToAdd).toPromise().then(res => {
      this.patientService.getPatient(res.id).toPromise().then(res2 => {
        this.patientAdded = res2
      })
    })
  }

  generateAlbums() {
    this.storySerivce.generateBasicAlbums(this.patientAdded.id).toPromise().then(res => {
      this.patientAddedAlbums = res;
    })
  }
}
