import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../core/authentication.service';
import {AlertController, NavController} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {MixpanelService} from '../../core/mixpanel.service';
import {FullstoryService} from '../../core/fullstory.service';
import {Observable} from 'rxjs/Rx';
import {switchMap, timeout, tap} from 'rxjs/operators';
import {UserService} from '../../core/user.service';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {TextInput} from 'ionic-angular/components/input/input';
import {RootComponent} from '../../root.component';

type authFunction = () => void;

@Component({
  selector: 'prisma-authentication-login',
  template: `
    <form [formGroup]="form" (ngSubmit)="login(form.getRawValue())">
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

        <ion-item padding>
          <ion-input
            [type]="type"
            #input
            formControlName="password"
            placeholder="Wachtwoord"
            clearOnEdit="false"
            clearInput>
          </ion-input>

          <button
            ion-button icon-only clear item-right
            (click)="toggleShow()" type="button">
            <ion-icon *ngIf="!show" name="eye" color="medium-gray"></ion-icon>
            <ion-icon *ngIf="show" name="eye-off" color="medium-gray"></ion-icon>
          </button>
        </ion-item>
      </ion-list>

      <button type="submit" ion-button solid block full large color="general"
              [disabled]="form.invalid">
        <div *ngIf="!loading">Aanmelden</div>
        <div *ngIf="loading">
          <ion-spinner item-start name="dots" color="white"></ion-spinner>
        </div>
      </button>

      <div class="signup-suggestion">
        <p class="alternate-option" (click)="onRegisterClick()">
          Nog geen account?
          <a color="general">
            Maak account.
          </a>
        </p>
        <p class="alternate-option" (click)="goToPasswordResetPage()">
          <a color="general">
            Wachtwoord vergeten?
          </a>
        </p>
      </div>
    </form>
  `
})
export class AuthenticationLoginComponent implements OnInit {
  form: FormGroup;
  type = 'password';
  show = false;
  loading = false;

  @ViewChild('inputEmail') inputEmail: TextInput;
  @Input() data: {email: string} = {email: ''};
  @Input() onRegisterClick: authFunction;
  @Input() onComplete: authFunction;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private alertCtrl: AlertController,
    private network: Network,
    private mixpanel: MixpanelService,
    private fullstory: FullstoryService,
    private userService: UserService,
    private navCtrl: NavController
  ) {}

  // TODO: display error message

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [this.data.email, [Validators.required, Validators.email], []],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40)
        ],
        []
      ]
    });

    setTimeout(() => {
      this.inputEmail.setFocus();
    }, 400);
  }

  toggleShow() {
    this.show = !this.show;
    this.type = this.show ? 'text' : 'password';
  }

  login({email, password}: {email: string; password: string}) {
    if (this.network.type === 'none') {
      return this.showError('Je bent niet verbonden met het internet.');
    }

    this.loading = true;
    const obs = this.auth.login(email, password).pipe(
      switchMap((res: boolean | Error) => {
        if (res instanceof Error) {
          this.mixpanel.track('LoginComponent::Login error', email);
          this.showError(res.message);
          return Observable.empty();
        }
        return Observable.of(res);
      }),
      /* timeout(10000),
        TODO this gave problems in re-login.
        Login succeeds, but the timeout still happens. This triggers showError, which does a logout...
        maybe the switchmap must complete ?

        */
      tap(() => {
        this.loading = false;
        this.mixpanel.identify(this.userService.getCurrentUser());
        this.fullstory.identify(this.userService.getCurrentUser());
        this.mixpanel.track(
          'LoginComponent::Login success',
          this.userService.getCurrentUser().email
        );
        this.onComplete();
      })
    );

    obs.subscribe(undefined, err => {
      this.mixpanel.track('LoginComponent::Login error', email);
      this.showError(err.message);
    });
  }

  goToPasswordResetPage(): void {
    this.navCtrl.push(PasswordResetComponent, {
      email: this.form.getRawValue().email
    });
  }

  showError(
    errorMessage: string = 'Je gebruikersnaam of wachtwoord klopt niet.'
  ) {
    this.loading = false;
    const alert = this.alertCtrl.create({
      title: errorMessage,
      buttons: ['Ok']
    });

    alert.present();

    this.auth.logout();
    this.navCtrl.setRoot(RootComponent, {isLogging: true});
  }
}
