import { AbstractUser } from './abstract-user';
import { WorkPlace } from './work-place';
import { LifeEvent } from './life-event';
import { Relation } from './relation';

export class Patient extends AbstractUser {
  careHouse: string;
  workPlaces: WorkPlace[];
  lifeEvents: LifeEvent[];
  relations: Relation[];
}
