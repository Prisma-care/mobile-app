import {Component, OnInit} from "@angular/core";
import {AlertController, MenuController, NavController} from "ionic-angular";
import {User} from "../../dto/user";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AlbumsPage} from "../albums/albums";
import {TranslatorService} from "../../providers/translator.service";
import {UtilService} from "../../providers/util-service";
import {NewLovedonePage} from "../new-lovedone/new-lovedone";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
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
    , public alertCtrl: AlertController, public translatorService: TranslatorService, public utilService: UtilService, public menu: MenuController) {
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
    this.loading = true;
    if (!this.email || !this.password) {
      this.loginError("Geen login/password");
      this.loading = false;
      return;
    }

    let loggedIn:boolean = false;
    let sub: Subscription = this.authService.login(this.email, this.password).subscribe(res => {
      if (this.authService.isLoggedIn()) {
        loggedIn = true;
        this.start();
      } else {
        this.loginError();
        this.loading = false;
      }
    })
    setTimeout(function() {
      if(loggedIn)
        return;
      sub.unsubscribe();
      this.loginError("Timeout");
      this.loading = false;
      return;
    }, 5000);
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
        this.navCtrl.setRoot(NewLovedonePage).then(res => {
          this.loading = false;
        });
      } else {
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
