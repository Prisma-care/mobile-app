import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Network } from '@ionic-native/network';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(private network: Network) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.network.type==='none'){
      return next.handle(req)
        .retryWhen(error => error.switchMap(() => Observable.timer(1000)))
    }
    return next.handle(req)
  }
}
