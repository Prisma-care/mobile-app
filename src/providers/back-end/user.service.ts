import {PrismaService} from "./prisma-api.service";
import {Observable} from "rxjs/Observable";
import {User} from "../../dto/user";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Patient} from "../../dto/patient";
import {env} from "../../app/environment";
import {Headers} from "@angular/http";

@Injectable()
export class PatientService extends PrismaService {


  getPatient(id: string, headers?: Headers): Observable<Patient> {
    let url: string = env.api.getPatient;
    return this._http.get(`${this._urlToApi}/${url}/${id}`, {
      headers: headers || this._head
    })
      .map(res => {
        console.log("Got patient: " + JSON.stringify(res.json().response));
        return new Patient(res.json().response) as Patient;
      })
      .catch(err => this.handleError(err));
  }


  addPatient(firstname: string, lastname: string,
    careHome?: string, dateOfBirth?: Date, birthPlace?: string, location?: string): Observable<Patient> {
    this.ngOnInit(); // try to refresh token
    let url: string = env.api.getPatient;

    console.log("creation token: " + localStorage.getItem(env.jwtToken))

    // TODO: convert date to "yyyy-mm-dd"
    var req = { firstName: firstname, lastName: lastname, dateOfBirth: dateOfBirth, birthPlace: birthPlace, location: location};

    return this._http.post(`${this._urlToApi}/${url}`, req, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 100 || res.status >= 300) {
          return null;
        }
        return new Patient(res.json().response) as Patient;
      }).catch(err => this.handleError(err));
  }


  getUser(id: string): Observable<User> {
    let url: string = env.api.getUser;
    return this._http.get(`${this._urlToApi}/${url}/${id}`, {
      headers: this._head
    })
      .map(res => {
        return new Patient(res.json().response) as Patient;
      })
      .catch(err => this.handleError(err));
  }

  addUser(user: User): Observable<User> {
    let url: string = env.api.getUser;
    return this._http.post(`${this._urlToApi}/${url}`, user, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 100 || res.status >= 300) {
          return null;
        }
        return new Patient(res.json().response) as Patient;
      }).catch(err => this.handleError(err));
  }

  inviteUser(invitationData:{inviterId : string , "firstName" :string, "lastName" : string , "email" : string, patientId : string}): Observable<boolean> {
    let url: string = env.api.invite;
    invitationData.patientId = invitationData.patientId.toUpperCase();
    return this._http.post(`${this._urlToApi}/${url}`, invitationData, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 100 || res.status >= 300) {
          return false;
        }
        return true;
      }).catch(err => this.handleError(err));

  }
}
