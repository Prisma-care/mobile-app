import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../core/authentication.service';
import {AlertController} from 'ionic-angular';
import {MixpanelService} from '../../core/mixpanel.service';
import {User} from '../../../dto/user';
import {Observable} from 'rxjs/Rx';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'prisma-authentication-register',
  template: `
    <form [formGroup]="form">
      <ion-list class="list">
        <ion-item padding>
          <ion-input #inputFirstname type="text" value="" formControlName="firstName" placeholder="Voornaam"
          ></ion-input>
        </ion-item>
        <ion-item padding>
          <ion-input type="text" value="" formControlName="lastName" placeholder="Naam"
          ></ion-input>
        </ion-item>
        <ion-item padding>
          <ion-input type="email" value="" formControlName="email" placeholder="E-mail"
          ></ion-input>
        </ion-item>
        <ion-item padding>
          <ion-input
            [type]="type" #input
            formControlName="password"
            placeholder="Wachtwoord"
            clearOnEdit="false" clearInput></ion-input>
          <button ion-button icon-only (click)="toggleShow()" clear item-right>
            <ion-icon *ngIf="!show" name="eye" color="medium-gray"></ion-icon>
            <ion-icon *ngIf="show" name="eye-off" color="medium-gray"></ion-icon>
          </button>
        </ion-item>
      </ion-list>

      <button ion-button solid block full large color="primary" (click)="register(form.getRawValue())"
              [disabled]="form.invalid">
        <div *ngIf="!loading">Maak account</div>
        <div *ngIf="loading">
          <ion-spinner item-start name="dots" color="white"></ion-spinner>
        </div>
      </button>

      <div class="signup-suggestion">
        <p class="alternate-option">Al een account? <a color="general" (click)="onLoginClick()">Aanmelden.</a></p>
      </div>
    </form>
  `
})
export class AuthenticationRegisterComponent implements OnInit {
  form: FormGroup;
  type = 'password';
  show = false;
  loading = false;

  @ViewChild('inputFirstname') inputFirstname;
  @Input() data: User;
  @Input() onLoginClick: Function = () => {};
  @Input() onComplete: Function = () => {};

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private alertCtrl: AlertController,
    private mixpanel: MixpanelService
  ) {}

  // TODO: display error message

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email], []],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40)
        ],
        []
      ],
      firstName: [null, [Validators.required], []],
      lastName: [null, [Validators.required], []]
    });

    setTimeout(() => {
      this.inputFirstname.setFocus();
    }, 400);
  }

  toggleShow() {
    this.show = !this.show;
    this.type = this.show ? 'text' : 'password';
  }

  register(credentials: User) {
    this.loading = true;
    const user: Partial<User> = {
      ...new User(),
      ...credentials
    };

    this.auth
      .signUp(user as User)
      .pipe(
        switchMap((res: boolean | Error) => {
          if (res instanceof Error) {
            this.mixpanel.track('LoginComponent::Register error', {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName
            });
            this.showError(res.message);
            return Observable.empty();
          }
          return Observable.of(res);
        }),
        tap(() => {
          this.mixpanel.track('LoginComponent::Register success', {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          });
          this.loading = false;
          this.onComplete();
        })
      )
      .subscribe(undefined, err => {
        this.mixpanel.track('LoginComponent::Register error', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.showError(err.message);
      });
  }

  showError(
    errorMessage: string = 'Onmogelijk om u te registreren, neem dan contact op met de beheerder'
  ) {
    this.loading = false;
    const alert = this.alertCtrl.create({
      title: errorMessage,
      buttons: ['Ok']
    });

    alert.present();

    this.auth.logout();
  }
}
