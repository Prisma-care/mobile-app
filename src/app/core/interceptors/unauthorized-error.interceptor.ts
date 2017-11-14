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
import {ConstantToken} from '../../di';
import {catchError} from 'rxjs/operators/catchError';
import {Constant} from '../../../shared/types';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  private AUTHENTICATION_PAGE_NAME = 'AuthenticationComponent';

  constructor(
    public app: App,
    @Inject(ConstantToken) private constant: Constant
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        // Check if we had 401 response
        if (
          httpError.status === 401 &&
          req.url.includes(this.constant.apiUrl)
        ) {
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
