import {Inject, Injectable} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {User} from "../../dto/user";
import {getMessageFromBackendError} from "../utils";

interface UserResponse {
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
export class UserService {
  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {

    this.handleError = this.handleError.bind(this);
  }

  getUser(): Observable<User | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getUser}/`)
      .map(({response}: UserResponse) => {
        return new User(response);
      })
      .catch(err => this.handleError(err));
  }


  addUser(user: User): Observable<User | any> {
    let url: string = this.env.api.getUser;
    return this.http.post(`${this.env.apiUrl}/${url}`, user)
      .map(({response}: UserResponse) => {
        return new User(response);
      }).catch(err => this.handleError(err));
  }

  inviteUser(invitationData: { inviterId: string, firstName: string, lastName: string, email: string, patientId: string }): Observable<boolean | any> {
    let url: string = this.env.api.invite;
    invitationData.patientId = invitationData.patientId.toUpperCase();
    return this.http.post(`${this.env.apiUrl}/${url}`, invitationData)
      .catch(err => this.handleError(err));
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.env.temp.currentUser)) as User;
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    console.log("err",err)
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
