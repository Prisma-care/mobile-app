import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Environment, EnvironmentToken} from '../environment';
import 'rxjs/add/operator/catch';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(EnvironmentToken) private env: Environment) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((error: HttpErrorResponse) => {
        // Check if we had 401 response
        if (error.status === 401) {
          // TODO : redirect to Login page
          console.log('UnauthorizedErrorInterceptor::HttpErrorResponse::401');
          this.clearTokens();
          return Observable.empty();
        }
        return Observable.throw(error);
      });
  }

  private clearTokens() {
    localStorage.removeItem(this.env.jwtToken);
    localStorage.removeItem(this.env.temp.currentUser);
    localStorage.removeItem(this.env.temp.currentPatient);
  }
}
