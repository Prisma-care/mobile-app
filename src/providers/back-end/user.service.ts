import {PrismaService} from "./prisma-api.service";
import {Observable} from "rxjs/Observable";
import {User} from "../../dto/user";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Patient} from "../../dto/patient";
import {env} from "../../app/environment";
import {Headers, Http} from "@angular/http";

@Injectable()
export class PatientService extends PrismaService {


  getPatient(id: string,headers?:Headers): Observable<Patient> {
    let url: string = env.api.getPatient;
    return this._http.get(`${this._urlToApi}/${url}/${id}`, {
      headers: headers || this._head
    })
      .map(res => {
        console.log("Got patient: " + JSON.stringify(res.json().response))
        return new Patient(res.json().response) as Patient;
      })
      .catch(err => this.handleError(err));
  }


  addPatient(patient: Patient): Observable<Patient> {
    let url: string = env.api.getPatient;
    return this._http.post(`${this._urlToApi}/${url}`, patient)
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
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
    return this._http.post(`${this._urlToApi}/${url}`, user)
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          return null;
        }
        return new Patient(res.json().response) as Patient;
      }).catch(err => this.handleError(err));
  }
}
