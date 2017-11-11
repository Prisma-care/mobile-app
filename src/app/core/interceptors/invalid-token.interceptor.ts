import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {App} from 'ionic-angular';
import {AuthenticationComponent} from '../../auth/authentication.component';
import {catchError} from 'rxjs/operators/catchError';

@Injectable()
export class InvalidTokenInterceptor implements HttpInterceptor {
  constructor(public app: App) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        // Check if we had 400 response and if the error is about the token
        if (
          httpError.status === 400 &&
          httpError.error.meta.message.includes('token is invalid')
        ) {
          this.clearTokens();
          const nav = this.app.getActiveNav();
          return nav.setRoot(AuthenticationComponent, {
            error: httpError.error.meta.message
          });
        }
        return Observable.throw(httpError);
      })
    );
  }

  private clearTokens() {
    localStorage.clear();
  }
}
