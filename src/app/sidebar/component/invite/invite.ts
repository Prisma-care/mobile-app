import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from '../../../core/authentication.service';
import {UserService} from '../../../core/user.service';
import {AlbumListComponent} from '../../../albumList/albumList.component';
import {MixpanelService} from '../../../core/mixpanel.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'prisma-invite',
  template: `
    <ion-header>
    <ion-navbar>
      <ion-title>Nodig iemand uit</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content padding>
    <form [formGroup]="form">
      <ion-list inset>
        <ion-item>
          <ion-input
            type="text"
            formControlName="firstName"
            placeholder="Voornaam"
            clearOnEdit="false"
            clearInput>
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            type="text"
            formControlName="lastName"
            placeholder="Name"
            clearOnEdit="false"
            clearInput>
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            type="email"
            formControlName="email"
            placeholder="E-mail"
            clearOnEdit="false"
            clearInput>
          </ion-input>
        </ion-item>
      </ion-list>
      <button ion-button solid block full large color="general"
              (click)="invite(form.getRawValue())"
              [disabled]="loading || form.invalid">
        <div *ngIf="!loading">Uitnodigen</div>
        <div *ngIf="loading">
          <ion-spinner item-start name="dots" color="white"></ion-spinner>
        </div>
      </button>
    </form>
  </ion-content>
  `
})
export class InviteComponent implements OnInit {
  patientId: number;
  inviterId: number;
  form: FormGroup;
  loading = false;

  constructor(
    public authService: AuthenticationService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private userService: UserService,
    public navParams: NavParams,
    private mixpanel: MixpanelService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [null, [Validators.required], []],
      lastName: [null, [Validators.required], []],
      email: [null, [Validators.required, Validators.email], []]
    });
  }

  ionViewDidLoad() {
    this.patientId = this.navParams.get('patientId');
    this.inviterId = this.userService.getCurrentUser().id;
  }

  invite({
    firstName,
    lastName,
    email
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    this.loading = true;
    this.mixpanel.track('InviteComponent::invite started');
    const data = {
      inviterId: this.inviterId,
      patientId: this.patientId,
      lastName,
      firstName,
      email
    };
    this.userService.inviteUser(data).subscribe(res => {
      if (res instanceof Error) {
        this.mixpanel.track('InviteComponent::invite error', data);
        this.invitePopup(firstName, res.message);
        this.loading = false;
      } else {
        this.mixpanel.track('InviteComponent::invite success', data);
        this.invitePopup(firstName);
        this.navCtrl.setRoot(AlbumListComponent);
      }
    });
  }

  invitePopup(firstName: string, message?: string) {
    const messageToSend = message
      ? `${firstName} kon niet uitgenodigd worden.${message}`
      : `${firstName} ontvangt een e-mail met je uitnodiging.`;
    this.alertCtrl
      .create({
        title: messageToSend,
        buttons: ['Ok']
      })
      .present();
  }
}
