import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Network} from '@ionic-native/network';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {LoaderService} from '../loader.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(private network: Network, private loader: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).retryWhen(error =>
      error
        .switchMap(e => {
          if (e.status === 0) {
            console.warn('No network, retrying request in 1 sec');
            this.loader.setConnection(false);
            return Observable.timer(1000);
          } else {
            return Observable.throw(e);
          }
        })
        .takeUntil(Observable.timer(10 * 1000))
        .finally(() => 'console log: waiting over')
    );
  }
}
