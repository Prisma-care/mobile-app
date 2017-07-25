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
  login(login:string, password:string): Observable<boolean> {
    let url: string = env.api.getSignIn;
    let userUrl: string = env.api.getUser;
    return this._http.post(`${this._urlToApi}/${userUrl}/${url}`,{"email":login,"password":password} , {
      headers: this._head,
    }).map(res => {
      if (res.status < 200 || res.status >= 300) {
        return false;
      }
      if(!res.json().response.token)
        return false;
      localStorage.setItem(env.jwtToken, res.json().response.token);
      this._head.set('Authorization', 'Bearer ' + localStorage.getItem(env.jwtToken));
      let userId:number = res.json().response.id || 1;
      if(userId)
        return this._http.get(`${this._urlToApi}/${url}/${userId}`, {
          headers: this._head
        })
          .map(res2 => {
            let user:User = res2.json().response;
            localStorage.setItem(env.temp.fakeUser,JSON.stringify(user));
            return true;
          })
      return true;
    }).catch(err => this.handleError(err));
  }
  // Logout a user, destroy token and remove
  // every information related to a user
  logout(): void {
    localStorage.removeItem(env.jwtToken);
    localStorage.removeItem(env.temp.fakeUser);
  }

  signUp(user:User): Observable<boolean>{
    let url: string = env.api.getUser;
    return this._http.post(`${this._urlToApi}/${url}`,user, {
      headers: this._head,
    }).map(res => {
      if (res.status < 200 || res.status >= 300) {
        return false;
      }
      return this.login(user.email,user.password).toPromise().then(res2 => res2);
    }).catch(err => this.handleError(err));
  }


  // Returns whether the user is currently authenticated
  // Checks if current token is still valid
  // the pages can sue this:  ionViewCanEnter() { return this.authService.isLoggedIn();} to secure the routes
  isLoggedIn(): boolean {
    return /** !!localStorage.getItem(env.temp.fakeUser) && */ !!localStorage.getItem(env.jwtToken);
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(env.temp.fakeUser)) as User;
  }

  getCurrentPatient(): Patient {
    return JSON.parse(localStorage.getItem(env.temp.fakePatient)) as Patient;
  }
}
