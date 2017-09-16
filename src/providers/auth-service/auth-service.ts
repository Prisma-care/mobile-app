import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {PrismaService} from "../back-end/prisma-api.service";
import {Observable} from "rxjs/Observable";
import {User} from "../../dto/user";
import {Patient} from "../../dto/patient";
import {env} from "../../app/environment";
import {PatientService} from "../back-end/user.service";
import {UtilService} from "../util-service";
import {Storage} from "@ionic/storage";
import {Http} from "@angular/http";

@Injectable()
export class AuthService extends PrismaService {
  patientService: PatientService;

  constructor(_httpSer: Http, storageSer: Storage, utilService: UtilService, public patientServiceIn: PatientService) {
    super(_httpSer, storageSer, utilService);
    this.patientService = patientServiceIn;

  }

  // Login a user
  // Normally make a server request and store
  // e.g. the auth token
  login(login: string, password: string): Observable<boolean | any > {
    let url: string = env.api.getSignIn;
    let userUrl: string = env.api.getUser;
    this.logout();
    return this._http.post(`${this._urlToApi}/${userUrl}/${url}`, {"email": login, "password": password}, {
      headers: this._head,
    }).map(res => {
      if (res.status < 200 || res.status >= 300) {
        return false;
      }
      if (!res.json().response.token)
        return false;
      localStorage.setItem(env.jwtToken, res.json().response.token);
      this._head.set('Authorization', 'Bearer ' + localStorage.getItem(env.jwtToken));
      let userId: number = res.json().response.id;
      if(!userId || !res.json().response.token)
        return false;

      let user: User = new User();
      user.id = "" + userId;
      localStorage.setItem(env.temp.currentPatient, JSON.stringify(res.json().response.patients[0] || ""));
      localStorage.setItem(env.temp.currentUser, JSON.stringify(user));
      return true;
    })
      .catch(err => this.handleError(err));
  }

  // Logout a user, destroy token and remove
  // every information related to a user
  logout(): void {
    localStorage.removeItem(env.jwtToken);
    localStorage.removeItem(env.temp.currentUser);
    localStorage.removeItem(env.temp.currentPatient);
  }

  signUp(user: User): Observable<boolean| any >  {
    let url: string = env.api.getUser;
    return this._http.post(`${this._urlToApi}/${url}`, user, {
      headers: this._head,
    }).map(res => {
      if (res.status < 200 || res.status >= 300) {
        return false;
      }
      console.log("trying to login");
      return this.login(user.email, user.password).toPromise();
    }).catch(err => this.handleError(err));
  }


  // Returns whether the user is currently authenticated
  // Checks if current token is still valid
  // the pages can sue this:  ionViewCanEnter() { return this.authService.isLoggedIn();} to secure the routes
  isLoggedIn(): boolean {
    return  !!localStorage.getItem(env.temp.currentPatient) &&   !!localStorage.getItem(env.jwtToken);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(env.temp.currentUser)) as User;
  }

  getCurrentPatient(): Patient {
    return JSON.parse(localStorage.getItem(env.temp.currentPatient)) as Patient;
  }

  // temp method to set a patient to the local storage
  setPatient(patient: Patient): void {
    localStorage.setItem(env.temp.currentPatient, JSON.stringify(patient));
  }
}
