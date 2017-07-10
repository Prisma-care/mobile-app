import { AbstractUser } from './abstract-user';
import { Relation } from './relation';

export class User extends AbstractUser {
  email: string;
  password: string;
  relations: Relation[];
}
