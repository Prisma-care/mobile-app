import { PrismaService } from "./prisma-api.service";
import { Observable } from "rxjs/Observable";
import { User } from "../../dto/user";

import { Injectable } from "@angular/core";

@Injectable()
export class UserService extends PrismaService {

  getUser(id: string): Observable<User> {
    return this._http.get("../../mock-api/users.json")
      .map(res => {
        console.log("look here " + JSON.stringify(res.json()));
        new User(res.json());
      })
      .catch(error => console.log(error.message ? error.message : error));
  }
}
