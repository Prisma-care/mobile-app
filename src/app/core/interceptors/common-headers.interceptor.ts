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
export class CommonHeadersInterceptor implements HttpInterceptor {
  constructor(@Inject(ConstantToken) private constant: Constant) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(this.constant.apiUrl)) {
      return next.handle(this.setHeaders(req));
    }
    return next.handle(req);
  }

  setHeaders(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': this.constant.apiUrl,
        // Request methods you wish to allow
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        // Set to true if you need the website to include cookies in  requests
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Content-Length, X-Requested-With'
      }
    });
  }
}
