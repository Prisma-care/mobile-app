import {Injectable} from '@angular/core';
import {ResponseContentType, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {PrismaService} from "../back-end/prisma-api.service";

@Injectable()
export class UrlHelperService extends PrismaService {

  get (url: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      this._http.get(url, {
        headers: this._head,
        responseType: ResponseContentType.Blob
      })
        .subscribe(m => {
          objectUrl = URL.createObjectURL(m.blob());
          observer.next(objectUrl);
        });

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }
}
