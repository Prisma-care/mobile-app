import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Environment, EnvironmentToken} from '../../environment';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(@Inject(EnvironmentToken) private env: Environment) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes(this.env.apiUrl)){
      return next.handle(this.setAuthorizationHeader(req));
    }
    return next.handle(req)
  }

  setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    
    return req.clone({ setHeaders: { Authorization: `Bearer ${localStorage.getItem(this.env.jwtToken)}` } });
  }
}
