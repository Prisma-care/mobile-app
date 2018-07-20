import {Inject, Injectable} from '@angular/core';
import {ConstantToken} from '../di';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {map, catchError, switchMap} from 'rxjs/operators';
import {User, Patient, UserRegister, Constant} from '../../shared/types';
import {getMessageFromBackendError} from '../../shared/utils';
import {UserService} from './user.service';
import {PatientService} from './patient.service';

interface LoginResponse {
  response: {
    token: string;
    patients: Patient[];
    id: string;
  };
}

@Injectable()
export class AuthenticationService {
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private http: HttpClient,
    private userService: UserService,
    private patientService: PatientService
  ) {
    this.handleError = this.handleError.bind(this);
  }

  login(email: string, password: string): Observable<boolean | Error> {
    const url = `${this.constant.apiUrl}/${this.constant.api.getUser}/${
      this.constant.api.getSignIn
    }`;
    return this.http.post(url, {email, password}).pipe(
      switchMap(({response: {token, patients, id}}: LoginResponse): Observable<
        boolean | Error
      > => {
        this.setAuthenticationInfoInStorage({
          token,
          currentPatient: patients[0],
          userId: id
        });

        this._isAuthenticated.next(true);
        return this._isAuthenticated.asObservable();
      }),
      switchMap(isAuthenticated => {
        return this.userService.getUser().pipe(
          map((user: User | Error) => {
            localStorage.setItem(
              this.constant.temp.currentUser,
              JSON.stringify(user)
            );
            this.userService.setRegistered();
          }),
          map(() => isAuthenticated)
        );
      }),
      catchError(this.handleError)
    );
  }

  signUp(user: UserRegister): Observable<boolean | Error> {
    return this.http
      .post(`${this.constant.apiUrl}/${this.constant.api.getUser}`, user)
      .pipe(
        switchMap((res: Object) => this.login(user.email, user.password)),
        catchError(this.handleError)
      );
  }

  resetPassword(email: string): Observable<Object | Error> {
    return this.http
      .post(`${this.constant.apiUrl}/reset`, {email})
      .pipe(catchError(this.handleError));
  }

  setAuthenticationInfoInStorage({
    token,
    currentPatient,
    userId
  }: {
    token: string;
    currentPatient: any;
    userId: string;
  }) {
    localStorage.setItem(this.constant.jwtToken, token);
    localStorage.setItem(
      this.constant.temp.currentPatient,
      JSON.stringify(currentPatient || '')
    );
    if (currentPatient) {
      this.patientService.setPatientExists(true);
    }
    localStorage.setItem(
      this.constant.temp.currentUser,
      JSON.stringify({id: userId})
    );
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    this._isAuthenticated.next(false);
    return Observable.of(
      new Error(
        `${getMessageFromBackendError(
          err.error && err.error.meta && err.error.meta.message
        )}
      `
      )
    );
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  autoLoad() {
    if (localStorage.getItem(this.constant.jwtToken)) {
      this._isAuthenticated.next(true);
    }
  }

  logout(): void {
    this.clearTokens();
    this._isAuthenticated.next(false);
  }

  private clearTokens() {
    localStorage.clear();
    this.patientService.setPatientExists(false);
  }
}
