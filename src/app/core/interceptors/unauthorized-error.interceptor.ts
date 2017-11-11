import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {App} from 'ionic-angular';
import {AuthenticationComponent} from '../../auth/authentication.component';
import {EnvironmentToken, Environment} from '../../environment';
import {catchError} from 'rxjs/operators/catchError';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  private AUTHENTICATION_PAGE_NAME = 'AuthenticationPage';

  constructor(
    public app: App,
    @Inject(EnvironmentToken) private env: Environment
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        // Check if we had 401 response
        if (httpError.status === 401 && req.url.includes(this.env.apiUrl)) {
          this.clearTokens();
          const nav = this.app.getActiveNav();
          const activeNavName = nav.getActive().name;
          return activeNavName === this.AUTHENTICATION_PAGE_NAME
            ? Observable.throw(httpError)
            : Observable.from(nav.setRoot(AuthenticationComponent)).switchMapTo(
                Observable.empty()
              );
        }
        return Observable.throw(httpError);
      })
    );
  }

  private clearTokens() {
    localStorage.clear();
  }
}
