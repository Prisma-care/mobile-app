import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {PrismaService} from "../back-end/prisma-api.service";
import {Observable} from "rxjs/Observable";
import {User} from "../../dto/user";
import {Patient} from "../../dto/patient";
import {env} from "../../app/environment";

@Injectable()
export class AuthService extends PrismaService {


  // Login a user
  // Normally make a server request and store
  // e.g. the auth token
  login(): Observable<boolean> {
    return null;
  }

  // Logout a user, destroy token and remove
  // every information related to a user
  logout(): void {

  }

  // Returns whether the user is currently authenticated
  // Checks if current token is still valid
  // the pages can sue this:  ionViewCanEnter() { return this.authService.isLoggedIn();} to secure the routes
  isLoggedIn(): boolean {
    return false;
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(env.temp.fakeUser)) as User;
  }

  getCurrentPatient(): Patient {
    return JSON.parse(localStorage.getItem(env.temp.fakePatient)) as Patient;
  }
}
