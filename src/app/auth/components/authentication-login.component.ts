import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../core/authentication.service';
import {AlertController, NavController} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {Analytics} from '../../../providers/analytics';
import {Observable} from 'rxjs/Observable';
import {UserService} from "../../core/user.service";
import {PasswordResetComponent} from "./password-reset/password-reset.component";

@Component({
  selector: 'prisma-authentication-login',
  template: `
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
            (click)="toggleShow()">
            <ion-icon *ngIf="!show" name="eye" color="medium-gray"></ion-icon>
            <ion-icon *ngIf="show" name="eye-off" color="medium-gray"></ion-icon>
          </button>
        </ion-item>
      </ion-list>

      <button ion-button solid block full large color="general"
              (click)="login(form.getRawValue())"
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
        <!--<p class="alternate-option" (click)="goToPasswordResetPage()">
          <a color="general">
            Wachtwoord vergeten?
          </a>
        </p>-->
      </div>
    </form>
  `,
})
export class AuthenticationLoginComponent implements OnInit {
  @Input()
  onRegisterClick: Function = () => {
  };

  @Input()
  onComplete: Function = () => {
  };

  @Input()
  data: { email: string } = { email: '' };

  @ViewChild('inputEmail')
  inputEmail

  form: FormGroup;
  type = "password";
  show = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private auth: AuthenticationService,
              private alertCtrl: AlertController,
              private network: Network,
              private analytics: Analytics,
              private userService: UserService,
              private navCtrl: NavController) {
  }

  // TODO: display error message

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        this.data.email, [
          Validators.required,
          Validators.email
        ],
        []
      ],
      password: [null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(40)
      ], []]
    });

    setTimeout(()=>{
      this.inputEmail.setFocus()
    },400)
  }

  toggleShow() {
    this.show = !this.show;
    this.type = this.show ? 'text' : 'password';
  }

  login({ email, password }: { email: string, password: string }) {
    if (this.network.type === "none") {
      return this.showError("Je bent niet verbonden met het internet.");
    }

    this.loading = true;
    this.auth.login(email, password)
      .switchMap((res: boolean | Error) => {
        if (res instanceof Error) {
          this.analytics.track('LoginComponent::Login error', email);
          this.showError(res.message);
          return Observable.empty();
        }
        return Observable.of(res);
      })
      .timeout(10000)
      .do(() => {
        this.loading = false;
        this.analytics.identify(this.userService.getCurrentUser());
        this.analytics.track('LoginComponent::Login success', this.userService.getCurrentUser().email);
        this.onComplete();
      })
      .subscribe(undefined, (err) => {
        this.analytics.track('LoginComponent::Login error', email);
        this.showError(err.message);
      })
  }

  goToPasswordResetPage():void{
    this.navCtrl.push(PasswordResetComponent, {
      "email":this.form.getRawValue().email
    });
  }

  showError(errorMessage: string = 'Je gebruikersnaam of wachtwoord klopt niet.') {
    this.loading = false;
    let alert = this.alertCtrl.create({
      title: errorMessage,
      buttons: ['Ok']
    });

    alert.present();

    this.auth.logout();
  }
}
