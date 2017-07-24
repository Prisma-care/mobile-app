import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  isSigningUp:boolean = false;

  login:string ="";
  password:string="";

  firstname:string="";
  lastname:string="";
  email:string ="";


 constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  signIn(){

  }
  signUp(){

  }
}
