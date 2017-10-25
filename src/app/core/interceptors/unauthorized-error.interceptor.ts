import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Environment, EnvironmentToken} from '../../environment';
import 'rxjs/add/operator/catch';
import {App} from 'ionic-angular';
import {AuthenticationPage} from '../../auth/authentication.component';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  private AUTHENTICATION_PAGE_NAME = 'AuthenticationPage';

  constructor(@Inject(EnvironmentToken) private env: Environment, public app: App) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .catch((httpError: HttpErrorResponse) => {
        // Check if we had 401 response
        if (httpError.status === 401) {
          console.log('UnauthorizedErrorInterceptor::HttpErrorResponse::401');
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
