import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PatientService} from "../../../core/patient.service";
import {Patient} from "../../../../dto/patient";
import {AlbumListPage} from "../../../albumList/albumList.component";

@Component({
  selector: 'prisma-new-lovedone',
  template:`
  <ion-header>
    <ion-navbar>
      <ion-title>
        Kies persoon
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content no-bounce>
  
    <form [formGroup]="form">
      <h1 class="prisma-title">Voor welke persoon verzamel<br/> je verhalen?</h1>
      <ion-list class="list">
        <ion-item padding>
          <ion-input
            type="text"
            value=""
            placeholder="Voornaam"
            formControlName="firstName"
          >
          </ion-input>
        </ion-item>
        <ion-item padding>
          <ion-input
            type="text"
            value=""
            placeholder="Naam"
            formControlName="lastName"
          >
          </ion-input>
        </ion-item>
      </ion-list>
  
      <button ion-button solid block full large color="general" (click)="start(form.getRawValue())" [disabled]="form.invalid">
        <div *ngIf="!loading">Start</div>
        <div *ngIf="loading">
          <ion-spinner item-start name="dots" color="white"></ion-spinner>
        </div>
      </button>
  
    </form>
  </ion-content>
  `,
})
export class NewLovedonePage implements OnInit {

  private loading: boolean = false;
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private lovedOnes: PatientService,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private patientService: PatientService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [
        null,
        [Validators.required, Validators.minLength(2)]
      ],
      lastName: [
        null,
        [Validators.required, Validators.minLength(2)]
      ]
    })
  }

  start({firstName, lastName}: { firstName: string; lastName: string }) {
    this.loading = true;
    this.lovedOnes.addPatient(firstName.trim(), lastName.trim())
      .subscribe((patient: Patient) => {
        patient.patient_id = patient.id;
        this.patientService.setPatient(patient);
        this.navCtrl.setRoot(AlbumListPage);
      }, () => {
        this.loading = false;
        this.creationError();
      });
  }

  private creationError(errorMessage?: string) {
    let alert = this.alertCtrl.create({
      title: "Oei!",
      subTitle: errorMessage || "Er was een probleem bij het maken van je geliefde. Probeer het nog eens opnieuw.",
      buttons: ['Ok']
    });
    return alert.present();
  }
}
