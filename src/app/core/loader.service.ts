import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoaderService {
  _connection: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {}

  setConnection(value: boolean): void {
    this._connection.next(value);
  }

  get connection(): Observable<boolean> {
    return this._connection.asObservable();
  }
}
