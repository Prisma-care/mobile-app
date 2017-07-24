import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {User} from "../../dto/user";
import {AuthService} from "../../providers/auth-service/auth-service";
import {AlbumsPage} from "../albums/albums";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  isSigningUp: boolean = false;

  password: string = "123";
  passwordConfirm: string = "123";

  firstname: string = "Jean";
  lastname: string = "Paci";
  email: string = "user@mail.com";


  constructor(public navCtrl: NavController, public navParams: NavParams,public authService:AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  signIn() {
    this.authService.login(this.email, this.password).toPromise().then(res => {
      if(res){
        this.navCtrl.push(AlbumsPage);
      }
    })
  }

  signUp() {
    let user: User = new User();
    user.email = this.email;
    user.password = this.password;
    user.firstName = this.firstname;
    user.lastName = this.lastname;
    this.authService.signUp(user).toPromise().then(res => {
      if(res){
        this.navCtrl.push(AlbumsPage);
      }
    })
  }
}
