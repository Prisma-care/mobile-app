import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { App } from 'ionic-angular';
import { AuthenticationPage } from '../../auth/authentication.component';
import { EnvironmentToken, Environment } from '../../environment';

@Injectable()
export class InvalidTokenInterceptor implements HttpInterceptor {

  constructor(public app: App,
              @Inject(EnvironmentToken) private env: Environment) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((httpError: HttpErrorResponse) => {
        // Check if we had 400 response and if the error is about the token
        if (httpError.status === 400 && httpError.error.meta.message.includes('token is invalid')){
          this.clearTokens();
          const nav = this.app.getActiveNav();
          return nav.setRoot(AuthenticationPage, {
            error: httpError.error.meta.message
          });
        }
        return Observable.throw(httpError)
      });
  }

  private clearTokens() {
    localStorage.clear();
  }
}
