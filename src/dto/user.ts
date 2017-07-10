import { AbstractUser } from './abstract-user';
import { Relation } from './relation';

export class User extends AbstractUser {

  email: string;
  password: string;
  relations: Relation[];

  constructor(json?) {
    super(json);
    if (json) {
      this.email = json.mail;
      this.password = json.password;
      json.relations.forEach(relation => {
        relation.id = relation.id ? relation.id : this.id;
        this.relations.push(new Relation(relation))}
        );
    }
  }

}
