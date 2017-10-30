import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../core/authentication.service';
import {AlertController, NavController} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {Analytics} from '../../../../providers/analytics';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../../../core/user.service";

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
              clearInput>
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

  form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private alertCtrl: AlertController) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        null, [
          Validators.required,
          Validators.email
        ],
        []
      ]
    });
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
