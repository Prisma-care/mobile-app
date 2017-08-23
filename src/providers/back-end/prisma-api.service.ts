import {Component,Injectable, OnInit} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {API_URL, env} from "../../app/environment";
import {Storage} from "@ionic/storage";
import {UtilService} from "../util-service";
import {LoginPage} from "../../pages/login/login";
import {MyApp} from "../../app/app.component";

import { NavController} from "ionic-angular";


@Injectable()
export class PrismaService implements OnInit {
  protected _urlToApi: string = API_URL;
  protected _head: Headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
  _http: Http;
  static storage: Storage;

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
    console.log("Error ! " + JSON.stringify(error));
    //logs out if no user token avaible when needed
    let errorString: string = JSON.stringify(error).toLowerCase() + " token_expired";
    if (errorString.indexOf("token_invalid") >= 0 || errorString.indexOf("token_expired") >= 0 ||
      errorString.indexOf("token_not_provided") >= 0) {
      console.log("Token expired or not provided");
      localStorage.removeItem(env.jwtToken);
      localStorage.removeItem(env.temp.fakeUser);
      localStorage.removeItem(env.temp.fakePatient);
      //  MyApp.getNav().push(LoginPage);
    }

    return Observable.of(error) as Observable<any>;
  }

  public printError(error: Response | any) {
    console.log("Error ! " + JSON.stringify(error));
    return Observable.of(error) as Observable<any>;
  }
}
