import {Inject, Injectable} from '@angular/core';
import {Environment, EnvironmentToken} from '../environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../../dto/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import {Patient} from '../../dto/patient';

interface LoginResponse {
  response: {
    token: string,
    patients: any[], // TODO: type patients
    id: string
  };
}

@Injectable()
export class AuthenticationService {
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {
  }

  login(email: string, password: string): Observable<boolean | Error> {
    if (!email || !password) {
      return Observable.throw(new Error('E-mail of wachtwoord zijn niet voorzien'))
    }

    let url = `${this.env.apiUrl}/${this.env.api.getUser}/${this.env.api.getSignIn}`;
    return this.http.post(url, { email, password })
      .map(({ response: { token, patients, id } }: LoginResponse) => {
        this.setAuthenticationInfoInStorage({
          token,
          currentPatient: patients[0],
          userId: id
        });

        this._isAuthenticated.next(true);
      })
      .catch((err) => {
        this._isAuthenticated.next(false);
        return Observable.of(err);
      })

  }

  signUp(user: User): Observable<boolean | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getUser}`, user)
      .switchMap(res => this.login(user.email, user.password))
      .catch(err => {
        this._isAuthenticated.next(false);
        return Observable.of(err);
      });
  }

  setAuthenticationInfoInStorage({ token, currentPatient, userId }: { token: string, currentPatient: any, userId: string }) {
    localStorage.setItem(this.env.jwtToken, token);
    localStorage.setItem(this.env.temp.currentPatient, JSON.stringify(currentPatient || ''));
    localStorage.setItem(this.env.temp.currentUser, JSON.stringify({ id: userId }));
  }


  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  get isAuthenticatedSync(): boolean {
    let isLogged: boolean;
    this.isAuthenticated.take(1).subscribe(val => isLogged = val);
    return isLogged;
  }

  // TODO: to replace by isAuthenticatedSync
  isLoggedIn():boolean {
    return this.isAuthenticatedSync;
  }

  logout(): void {
    this.clearTokens();
    this._isAuthenticated.next(false);
  }

  private clearTokens() {
    localStorage.removeItem(this.env.jwtToken);
    localStorage.removeItem(this.env.temp.currentUser);
    localStorage.removeItem(this.env.temp.currentPatient);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.env.temp.currentUser)) as User;
  }

  getCurrentPatient(): Patient {
    return JSON.parse(localStorage.getItem(this.env.temp.currentPatient)) as Patient;
  }

  // temp method to set a patient to the local storage
  setPatient(patient: Patient): void {
    localStorage.setItem(this.env.temp.currentPatient, JSON.stringify(patient));
  }
}
