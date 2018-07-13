import {Inject, Injectable} from '@angular/core';
import {ConstantToken} from '../di';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, pipe} from 'rxjs/Rx';
import {map, catchError} from 'rxjs/operators';
import {getMessageFromBackendError} from '../../shared/utils';
import {Patient, Constant} from '../../shared/types';

interface PatientResponse {
  response: {
    patient_id: number;
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class PatientService {
  patientPipe = pipe(
    map(({response}: PatientResponse) => response as Patient),
    catchError(this.handleError)
  );

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private http: HttpClient
  ) {
    this.handleError = this.handleError.bind(this);
  }

  getPatient(id: number): Observable<Patient | Error> {
    return this.http
      .get(`${this.constant.apiUrl}/${this.constant.api.getPatient}/${id}`)
      .let(this.patientPipe);
  }

  addPatient(firstName: string, lastName: string): Observable<Patient | Error> {
    return this.http
      .post(`${this.constant.apiUrl}/${this.constant.api.getPatient}`, {
        firstName,
        lastName
      })
      .let(this.patientPipe);
  }

  patientExists(): boolean {
    // return Boolean(this.constant.temp.currentPatient);
    return Boolean(localStorage.getItem(this.constant.temp.currentPatient));
  }

  getCurrentPatient(): Patient {
    return JSON.parse(
      localStorage.getItem(this.constant.temp.currentPatient)
    ) as Patient;
  }

  setPatient(patient: Patient): void {
    localStorage.setItem(
      this.constant.temp.currentPatient,
      JSON.stringify(patient)
    );
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(
      new Error(
        `${getMessageFromBackendError(
          err.error && err.error.meta && err.error.meta.message
        )}
      `
      )
    );
  }
}
