import {AbstractUser} from "./abstract-user";
import {Relation} from "./relation";

export class User extends AbstractUser {

  email: string;
  password: string;
  relations: Relation[] = [];
  constructor(json?) {
    super(json);
    if (!json)
      return;
    this.email = json.email;
    this.password = json.password;
    this.relations = [];
    json.relations.forEach(relation => this.relations.push(new Relation(relation)));
  }
}
