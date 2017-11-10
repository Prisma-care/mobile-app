import {Inject, Injectable} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, pipe} from "rxjs/Rx";
import {map, catchError} from 'rxjs/operators'
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

  userMap = map(({response}: UserResponse) => new User(response))

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {

    this.handleError = this.handleError.bind(this);
  }

  getUser(): Observable<User | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getUser}/`)
      .pipe(
        this.userMap,
        catchError(this.handleError)
      )
  }


  addUser(user: User): Observable<User | any> {
    let url: string = this.env.api.getUser;
    return this.http.post(`${this.env.apiUrl}/${url}`, user)
      .pipe(
        this.userMap,
        catchError(this.handleError)
      )
  }

  inviteUser(invitationData: { inviterId: string, firstName: string, lastName: string, email: string, patientId: string }): Observable<Object | Error> {
    let url: string = this.env.api.invite;
    const copyInvitationData = {
      ...invitationData,
      patientId:invitationData.patientId.toUpperCase()
    };
    return this.http.post(`${this.env.apiUrl}/${url}`, copyInvitationData)
      .pipe(
        catchError(this.handleError)
      )
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.env.temp.currentUser)) as User;
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
