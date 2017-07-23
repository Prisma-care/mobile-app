import {Component} from "@angular/core";
import {Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {TutorialPage} from "../pages/tutorial/tutorial";
import {PatientService} from "../providers/back-end/user.service";
import {env} from "./environment";
import {User} from "../dto/user";
import { AlbumsPage } from "../pages/albums/albums";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TutorialPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public patientService: PatientService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.patientService.getPatient("1").toPromise().then(res => localStorage.setItem(env.temp.fakePatient, JSON.stringify(res)));
      let fakeUser: User = new User();
      fakeUser.email = "prisma@mail.com";
      fakeUser.password = "prisma";
      fakeUser.firstName = "Frederik";
      fakeUser.lastName = "Jinx";
      localStorage.setItem(env.temp.fakeUser, JSON.stringify(fakeUser));
      // this.patientService.addUser(fakeUser).toPromise().then(res => localStorage.setItem(env.temp.fakeUser,JSON.stringify(res)));
      //this.patientService.getUser("1").toPromise().then(res => localStorage.setItem(env.temp.fakeUser,JSON.stringify(res)));
    });
  }
}
