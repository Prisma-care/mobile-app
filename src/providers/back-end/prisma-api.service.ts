import {Injectable, OnInit} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {API_URL, env} from "../../app/environment";
import {Storage} from "@ionic/storage";
import {UtilService} from "../util-service";


@Injectable()
export class PrismaService implements OnInit {
  static storage: Storage;
  _http: Http;
  protected _urlToApi: string = API_URL;
  protected _head: Headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});

  constructor(_httpSer: Http, storageSer: Storage, utilService: UtilService) {

    this._http = _httpSer;
    PrismaService.storage = storageSer;
    //this._head.set('Accept', 'application/json,application/pdf,application/plain; charset=UTF-8');
    this._head.set('Accept', 'application/json');
    // Domain you wish to allow
    this._head.set('Access-Control-Allow-Origin', API_URL);
    // Request methods you wish to allow
    this._head.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // Set to true if you need the website to include cookies in  requests
    this._head.set('Access-Control-Allow-Credentials', JSON.stringify(true));
    this._head.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    this._head.set('Authorization', 'Bearer ' + localStorage.getItem(env.jwtToken));
  }

  ngOnInit() {
    this._head.set('Authorization', 'Bearer ' + localStorage.getItem(env.jwtToken));
  }

  ngOnDestroy() {
    this._head.delete('Authorization');
  }

  public handleError(error: Response | any) {

    if (error.status === 401) {
      localStorage.removeItem(env.jwtToken);
      localStorage.removeItem(env.temp.currentUser);
      localStorage.removeItem(env.temp.currentPatient);
      //  MyApp.getNav().push(LoginPage);
    }

    return Observable.of(error) as Observable<any>;
  }

  public printError(error: Response | any) {
    return Observable.of(error) as Observable<any>;
  }
}
