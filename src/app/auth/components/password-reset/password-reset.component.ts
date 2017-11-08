import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController} from 'ionic-angular';
import {NavParams} from 'ionic-angular/navigation/nav-params';
import {AuthenticationService} from "../../../core/authentication.service";

@Component({
  selector: 'prisma-password-reset',
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>
          Nieuw wachtwoord
        </ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content no-bounce>
      <p class="text-password-reset">
        Ontvang een nieuw <br/>wachtwoord in je mailbox.
      </p>
      <form [formGroup]="form">
        <ion-list class="list">
          <ion-item padding>
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
              private navParams: NavParams,
              private authService: AuthenticationService,
              private navCtrl: NavController) {
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

    setTimeout(() => {
      this.inputEmail.setFocus()
    }, 400)
  }

  resetPassword({email}: { email: string }) {
    this.authService.resetPassword(email).subscribe((data) => {
      if (data instanceof Error) {
        this.showMessage(data.message)
      } else {
        this.showMessage('OK')
        this.navCtrl.pop()
      }
    })
  }

  showMessage(message: string) {
    this.loading = false;
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Ok']
    });

    alert.present();
  }
}
