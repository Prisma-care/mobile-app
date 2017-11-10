import {Inject, Injectable} from '@angular/core';
import {Environment, EnvironmentToken} from '../environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from '../../dto/user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import {getMessageFromBackendError} from '../utils';
import { UserService } from "./user.service";

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
              private http: HttpClient, private userService: UserService) {

    this.handleError = this.handleError.bind(this);
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
        return this.isAuthenticatedSync;
      })
      // chain by getting & setting full user info (for Mixpanel)
      .switchMap((authSync) => {
        return this.userService.getUser()
        .map((user) => {
          localStorage.setItem(this.env.temp.currentUser, JSON.stringify(user))})
        .map(() => authSync);
      })
      .catch(this.handleError)

  }

  signUp(user: User): Observable<boolean | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getUser}`, user)
      .switchMap(res => this.login(user.email, user.password))
      .catch(this.handleError);
  }

  resetPassword(email: string) : Observable<boolean | Error>{
    return this.http.post(`${this.env.apiUrl}/reset`, {email})
      .catch(this.handleError)
  }

  setAuthenticationInfoInStorage({ token, currentPatient, userId }: { token: string, currentPatient: any, userId: string }) {
    localStorage.setItem(this.env.jwtToken, token);
    localStorage.setItem(this.env.temp.currentPatient, JSON.stringify(currentPatient || ''));
    localStorage.setItem(this.env.temp.currentUser, JSON.stringify({ id: userId }));
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    this._isAuthenticated.next(false);
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
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
  isLoggedIn(): boolean {
    return this.isAuthenticatedSync;
  }

  autoLoad(){
    if(localStorage.getItem(this.env.jwtToken)){
      this._isAuthenticated.next(true)
    }
  }

  logout(): void {
    this.clearTokens();
    this._isAuthenticated.next(false);
  }

  private clearTokens() {
    localStorage.clear();
  }

}
