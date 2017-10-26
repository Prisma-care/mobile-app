import {Inject, Injectable} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {getMessageFromBackendError} from "../utils";
import {Patient} from "../../dto/patient";

interface PatientResponse {
  response: {
    id: number,
    firstName: string,
    lastName: string,
    careHome?: string,
    dateOfBirth?: string,
    birthPlace?: string,
    location?: string
  };
}


@Injectable()
export class PatientService {
  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {

    this.handleError = this.handleError.bind(this);
  }

  getPatient(id: string): Observable<Patient | Error> {
    let url: string = this.env.api.getPatient;
    return this.http.get(`${this.env.apiUrl}/${url}/${id}`)
      .map(({response}: PatientResponse) => {
        return new Patient(response);
      })
      .catch(err => this.handleError(err));
  }


  addPatient(firstName: string, lastName: string,
             careHome?: string, dateOfBirth?: Date, birthPlace?: string, location?: string): Observable<Patient | Error> {
    // TODO: convert date to "yyyy-mm-dd"
    const req = {
      firstName,
      lastName,
      careHome,
      dateOfBirth,
      birthPlace,
      location
    };

    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}`, req)
      .map(({response}: PatientResponse) => {
        return new Patient(response);
      }).catch(err => this.handleError(err));
  }

  getCurrentPatient(): Patient {
    return JSON.parse(localStorage.getItem(this.env.temp.currentPatient)) as Patient;
  }

  setPatient(patient: Patient): void {
    localStorage.setItem(this.env.temp.currentPatient, JSON.stringify(patient));
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
