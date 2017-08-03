import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {User} from "../../dto/user";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AlbumsPage} from "../albums/albums";
import {TranslatorService} from "../../providers/translator.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  private translate: TranslateService;
  private translator:TranslatorService;

  isSigningUp: boolean = false;

  password: string = "";
  passwordConfirm: string = "";

  firstname: string = "";
  lastname: string = "";
  email: string = "";


  constructor(public navCtrl: NavController, public authService: AuthService
    , public alertCtrl: AlertController,  public translatorService: TranslatorService) {
    translatorService.refresh();
    this.translate = translatorService.translate;
    this.translator = translatorService;
  }


  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.navCtrl.setRoot(AlbumsPage);
    }
  }

  ionViewCanLeave(): boolean {
    return true;
  }

  signIn() {
    if (!this.email || !this.password) {
      this.loginError("Geen login/password");
      return;
    }
    this.authService.login(this.email, this.password).toPromise().then(res => {
      if (this.authService.isLoggedIn()) {
        this.navCtrl.setRoot(AlbumsPage);
      } else {
        this.loginError();
      }
    })
  }

  loginError(errorMessage?:string) {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: "Bad login/password",
      buttons: ['Ok']
    });
    //refreshes the password
    this.password= "";
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
        this.navCtrl.setRoot(AlbumsPage);
      }else {
        this.loginError("Invalid data");
      }
    })
  }
}
