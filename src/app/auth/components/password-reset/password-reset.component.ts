import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../core/authentication.service';
import {AlertController, NavController} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {Analytics} from '../../../../providers/analytics';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../../../core/user.service";
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'prisma-password-reset',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Nieuw wachtwoord</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <p class="text-password-reset">
        Ontvang een nieuw <br/>wachtwoord in je mailbox.
      </p>
      <form [formGroup]="form">
        <ion-list inset>
          <ion-item>
            <ion-input
              type="email"
              formControlName="email"
              placeholder="E-mail"
              clearOnEdit="false"
              clearInput
              #inputEmail>
            </ion-input>
          </ion-item>
        </ion-list>

        <button ion-button solid block full large color="general"
                (click)="resetPassword(form.getRawValue())"
                [disabled]="form.invalid">
          <div *ngIf="!loading">Verzenden</div>
          <div *ngIf="loading">
            <ion-spinner item-start name="dots" color="white"></ion-spinner>
          </div>
        </button>
      </form>
    </ion-content>
  `,
})
export class PasswordResetComponent implements OnInit {

  @ViewChild('inputEmail')
  inputEmail

  form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private alertCtrl: AlertController,
              private navParams: NavParams) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        this.navParams.get('email'), [
          Validators.required,
          Validators.email
        ],
        []
      ]
    });
  }

  ionViewDidEnter(){
    setTimeout(()=>{
      this.inputEmail.setFocus()
    },50)
  }

  resetPassword({email}: { email: string }) {
    console.log("hello", email)
  }

  showError(errorMessage: string = 'Je gebruikersnaam of wachtwoord klopt niet.') {
    this.loading = false;
    let alert = this.alertCtrl.create({
      title: errorMessage,
      buttons: ['Ok']
    });

    alert.present();
  }
}
