import {Inject, Injectable} from '@angular/core';
import {ConstantToken} from '../di';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, pipe} from 'rxjs/Rx';
import {map, catchError} from 'rxjs/operators';
import {User, Constant} from '../../shared/types';
import {getMessageFromBackendError} from '../../shared/utils';

interface UserResponse {
  response: User;
}

interface InvitationData {
  patientId: number;
  inviterId: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class UserService {
  userPipe = pipe(
    map(({response}: UserResponse) => response as User),
    catchError(this.handleError)
  );

  constructor(
    @Inject(ConstantToken) private constant: Constant,
    private http: HttpClient
  ) {
    this.handleError = this.handleError.bind(this);
  }

  getUser(): Observable<User | Error> {
    return this.http
      .get(`${this.constant.apiUrl}/${this.constant.api.getUser}/`)
      .let(this.userPipe);
  }

  addUser(user: User): Observable<User | any> {
    const url: string = this.constant.api.getUser;
    return this.http
      .post(`${this.constant.apiUrl}/${url}`, user)
      .let(this.userPipe);
  }

  inviteUser(invitationData: InvitationData): Observable<Object | Error> {
    const url: string = this.constant.api.invite;
    const copyInvitationData = {
      ...invitationData,
      patientId: invitationData.patientId
    };
    return this.http
      .post(`${this.constant.apiUrl}/${url}`, copyInvitationData)
      .pipe(catchError(this.handleError));
  }

  getCurrentUser(): User {
    return JSON.parse(
      localStorage.getItem(this.constant.temp.currentUser)
    ) as User;
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
