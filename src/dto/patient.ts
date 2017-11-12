import {AbstractUser} from './abstract-user';
import {WorkPlace} from './work-place';
import {Relation} from './relation';
import {Category} from './category';

export class Patient {
  id: number;
  patient_id: number;
  firstName: string;
  lastName: string;
  careHome?: string;
  dateOfBirth?: string;
  birthPlace?: string;
  location?: string;
  updatedAt?: Date;
  createdAt?: Date;
  workPlaces?: WorkPlace[] = [];
  relations?: Relation[] = [];
  interests?: Category[] = [];
}
