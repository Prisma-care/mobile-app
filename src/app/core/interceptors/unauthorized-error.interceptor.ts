import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { App } from 'ionic-angular';
import { AuthenticationPage } from '../../auth/authentication.component';
import { EnvironmentToken, Environment } from '../../environment';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  private AUTHENTICATION_PAGE_NAME = 'AuthenticationPage';

  constructor(public app: App,
    @Inject(EnvironmentToken) private env: Environment) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((httpError: HttpErrorResponse) => {
        // Check if we had 401 response
        if (httpError.status === 401 && req.url.includes(this.env.apiUrl)) {
          console.log('UnauthorizedErrorInterceptor::HttpErrorResponse::401');
          console.log("error", httpError)
          this.clearTokens();
          const nav = this.app.getActiveNav();
          const activeNavName = nav.getActive().name;
          return activeNavName === this.AUTHENTICATION_PAGE_NAME
            ? Observable.throw(httpError)
            : Observable.from(nav.setRoot(AuthenticationPage)).switchMapTo(Observable.empty());
        }
        return Observable.throw(httpError);
      });
  }

  private clearTokens() {
    localStorage.clear();
  }
}
