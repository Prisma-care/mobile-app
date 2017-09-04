import {AbstractUser} from "./abstract-user";
import {WorkPlace} from "./work-place";
import {Relation} from "./relation";
import {Category} from "./category";

export class Patient extends AbstractUser {


  patient_id: string;
  careHome: string;
  workPlaces: WorkPlace[] = [];
  relations: Relation[] = [];
  interests: Category[] = [];

  constructor(json?) {
    super(json);
    if (!json)
      return;
    this.patient_id = json.patient_id;
    this.firstName = json.first_name;
    this.lastName = json.last_name;
    this.careHome = json.carehome;
    if (json.workPlaces)
      json.workPlaces.forEach(workPlace => this.workPlaces.push(new WorkPlace(workPlace)));
    if (json.connections)
      json.connections.forEach(connection => this.relations.push(new Relation(connection)));
    if (json.interests)
      json.interests.forEach(category => this.interests.push(new Category(category)));
  }
}
