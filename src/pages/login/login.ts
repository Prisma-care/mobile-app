import {Component, OnInit} from "@angular/core";
import {AlertController, MenuController, NavController} from "ionic-angular";
import {User} from "../../dto/user";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AlbumsPage} from "../albums/albums";
import {TranslatorService} from "../../providers/translator.service";
import {UtilService} from "../../providers/util-service";
import {NewLovedonePage} from "../new-lovedone/new-lovedone";
import {Subscription} from "rxjs/Subscription";
import {Network} from "@ionic-native/network";
import {Analytics} from '../../providers/analytics';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  public static TIMEOUTTIME = 5000;
  isSigningUp: boolean = false;
  password: string = "";
  passwordConfirm: string = "";
  firstname: string = "";
  lastname: string = "";
  email: string = "";
  loading: boolean = false;
  type = "password";
  show = false;
  util: UtilService;
  private translator: TranslatorService;

  constructor(public navCtrl: NavController, public authService: AuthService
    , public alertCtrl: AlertController, public translatorService: TranslatorService,
    public utilService: UtilService, public menu: MenuController,
    private network: Network, private analytics: Analytics) {
    translatorService.refresh();
    this.translator = translatorService;
    this.util = utilService;
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.navCtrl.setRoot(AlbumsPage);
    }
  }

  ionViewCanLeave(): boolean {
    return true;
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  toggleShow() {
    this.show = !this.show;
    this.type = this.show ? "text" : "password";
  }


  canSignIn(): boolean {
    return this.util.checkEmail(this.email) && this.util.checkPassword(this.password);
  }

  signIn() {
    if (this.loading)
      return;

    if (this.network.type === "none") {
      this.loginError("Je bent niet verbonden met het internet.");
      return;
    }

    this.loading = true;
    if (!this.email || !this.password) {
      this.loginError("Geen login/password");
      this.loading = false;
      return;
    }

    let loggedIn: boolean = false;
    let sub: Subscription = this.authService.login(this.email, this.password)
      .timeout(LoginPage.TIMEOUTTIME)
      .subscribe(res => {
        if (this.authService.isLoggedIn()) {
          this.analytics.track('LoginComponent::Login success', this.authService.getCurrentUser().email);
          loggedIn = true;
          this.start();
        } else {
          this.analytics.track('LoginComponent::Login error', this.authService.getCurrentUser().email);
          this.loginError();
          this.loading = false;
        }
    },
    () => {
      Error("login error");
      this.loading = false;
    },
    () => {
      this.loading = false;
    }
  )

    var that = this;

    // purpose of this:
    // disable the current request after randomly defined TIMEOUTTIME ?

    setTimeout(function () {
      if (loggedIn)
        return;
      if(that.loading)
        return;
      sub.unsubscribe();
      this.analytics.track('LoginComponent::Logout-Timeout', this.authService.getCurrentUser().email);
      // that.loginError("Timeout"); // weird second error in UX
      that.authService.logout();
      that.loading = false;
      }, LoginPage.TIMEOUTTIME);

  }

  start(): void {
    // TODO implement redirect to loved one creation if not yet connected to a loved one!
    this.navCtrl.setRoot(AlbumsPage).then(res => {
      this.loading = false;
    });
  }

  loginError(errorMessage?: string) {

    var errorMsgDefault = "Je gebruikersnaam of wachtwoord klopt niet.";

    this.translator.translate([errorMessage, errorMsgDefault], (translations) => {
      let alert = this.alertCtrl.create({
        title: errorMessage ? translations[errorMessage] : translations[errorMsgDefault],
        buttons: ['Ok']
      });
      //refreshes the password
      //this.password = "";
      alert.present();
    });
    this.authService.logout();

  }

  signUp() {
    if (this.loading)
      return;
    this.loading = true;
    let user: User = new User();
    user.email = this.email;
    user.password = this.password;
    user.firstName = this.firstname;
    user.lastName = this.lastname;
    this.authService.signUp(user).toPromise().then(res => {
      if (res) {
        this.analytics.track('LoginComponent::Register success', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.navCtrl.setRoot(NewLovedonePage).then(res => {
          this.loading = false;
        });
      } else {
        this.analytics.track('LoginComponent::Register error', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
        this.loginError("Invalid data");
        this.loading = false;
        return;
      }
    })
  }

  canSignUp(): boolean {
    return !(this.util.checkEmail(this.email)
      && this.util.checkPassword(this.password)
      && this.firstname && this.lastname);
  }
}
