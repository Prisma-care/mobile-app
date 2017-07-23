import {Injectable, OnInit} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {API_URL, env} from "../../app/environment";
import {Storage} from "@ionic/storage";


@Injectable()
export class PrismaService implements OnInit {
  protected _urlToApi: string = API_URL;
  protected _head: Headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
  _http: Http;
  static storage: Storage;

  constructor(_httpSer: Http, storageSer: Storage) {
    this._http = _httpSer;
    PrismaService.storage = storageSer;
    // this._head.set('Accept', 'application/json,application/pdf,application/plain; charset=UTF-8');
    // Domain you wish to allow
    this._head.set('Access-Control-Allow-Origin', API_URL);
    // Request methods you wish to allow
    this._head.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Set to true if you need the website to include cookies in  requests
    this._head.set('Access-Control-Allow-Credentials', JSON.stringify(true));
    this._head.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    var jwt = localStorage.getItem(env.jwtToken);
    this._head.set('Authorization', 'Bearer ' + jwt);
  }

  ngOnInit() {
    var jwt = localStorage.getItem(env.jwtToken);
    this._head.set('Authorization', 'Bearer ' + jwt);
  }

  ngOnDestroy() {
    this._head.delete('Authorization');
  }

  public handleError(error: Response | any) {
    console.log("Error ! " + JSON.stringify(error));
    return Observable.of(error) as Observable<any>;
  }
}
