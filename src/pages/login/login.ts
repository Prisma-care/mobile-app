import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {User} from "../../dto/user";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AlbumsPage} from "../albums/albums";
import {TranslatorService} from "../../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";
import {UtilService} from "../../providers/util-service";
import { NewLovedonePage } from "../new-lovedone/new-lovedone";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  private translator: TranslatorService;

  isSigningUp: boolean = false;

  password: string = "";
  passwordConfirm: string = "";

  firstname: string = "";
  lastname: string = "";
  email: string = "";

  loading: boolean = false;
  type = "password";
  show = false;
  util:UtilService;

  constructor(public navCtrl: NavController, public authService: AuthService
    , public alertCtrl: AlertController, public translatorService: TranslatorService, public utilService: UtilService) {
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


  toggleShow() {
    this.show = !this.show;
    this.type = this.show ? "text" : "password";
  }


  canSignIn():boolean {
    return !(this.util.checkEmail(this.email) && this.util.checkPassword(this.password));
  }

  signIn() {
    if (this.loading)
      return;
    this.loading = true;
    if (!this.email || !this.password) {
      this.loginError("Geen login/password");
      this.loading = false;
      return;
    }
    this.authService.login(this.email, this.password).toPromise().then(res => {
      if (this.authService.isLoggedIn()) {
        this.start();
      } else {
        this.loginError();
        this.loading = false;
      }

    })
  }

  start(): void {
    // TODO implement redirect to loved one creation if not yet connected to a loved one!
    this.navCtrl.setRoot(AlbumsPage).then(res => {this.loading = false;});
  }

  loginError(errorMessage?: string) {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: "Bad login/password",
      buttons: ['Ok']
    });
    //refreshes the password
    //this.password = "";
    return alert.present();
  }

  signUp() {
    let user: User = new User();
    user.email = this.email;
    user.password = this.password;
    user.firstName = this.firstname;
    user.lastName = this.lastname;
    this.authService.signUp(user).toPromise().then(res => {
      if (res) {
        this.navCtrl.setRoot(NewLovedonePage).then(res => {this.loading = false;});
      } else {
        this.loginError("Invalid data");
      }
    })
  }

  canSignUp():boolean {
    return !(this.util.checkEmail(this.email)
      && this.util.checkPassword(this.password)
      && this.firstname && this.lastname);
  }
}
