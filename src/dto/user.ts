import {AbstractUser} from './abstract-user';
import {Relation} from './relation';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  birthPlace?: string;
  updatedAt?: Date;
  createdAt?: Date;
  location?: string;
  email?: string;
  password?: string;
  relations?: Relation[] = [];
}
