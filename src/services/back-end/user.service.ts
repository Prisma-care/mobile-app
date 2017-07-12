import { PrismaService } from "./prisma-api.service";
import { Observable } from "rxjs/Observable";
import { User } from "../../dto/user";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import { Injectable } from "@angular/core";

@Injectable()
export class UserService extends PrismaService {


  getUser(id: string): Observable<User> {
    return this._http.get("assets/json/users_id.json").map(res => {
        return new User(res.json());
      })
      .catch(error => this.handleError(error));
  }
}
