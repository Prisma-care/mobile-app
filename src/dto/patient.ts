import {AbstractUser} from "./abstract-user";
import {WorkPlace} from "./work-place";
import {LifeEvent} from "./life-event";
import {Relation} from "./relation";
import {Category} from "./category";

export class Patient extends AbstractUser {
  careHouse: string;
  workPlaces: WorkPlace[] = [];
  lifeEvents: LifeEvent[] = [];
  relations: Relation[] = [];
  interests: Category[] = [];


  constructor(json?) {
    super(json);
    if (!json)
      return;
    this.careHouse = json.careHouse;
    if (json.workPlaces)
      json.workPlaces.forEach(workPlace => this.workPlaces.push(new WorkPlace(workPlace)));
    if (json.lifeEvents)
      json.lifeEvents.forEach(lifeEvent => this.lifeEvents.push(new LifeEvent(lifeEvent)));
    if (json.relations)
      json.relations.forEach(relation => this.relations.push(new Relation(relation)));
    if (json.interests)
      json.interests.forEach(category => this.interests.push(new Category(category)));
  }
}
