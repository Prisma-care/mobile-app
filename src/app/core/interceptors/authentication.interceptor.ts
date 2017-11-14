import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ConstantToken} from '../../di';
import {Constant} from '../../../shared/types';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(@Inject(ConstantToken) private constant: Constant) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(this.constant.apiUrl)) {
      return next.handle(this.setAuthorizationHeader(req));
    }
    return next.handle(req);
  }

  setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem(this.constant.jwtToken)}`
      }
    });
  }
}
