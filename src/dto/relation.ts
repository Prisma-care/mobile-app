export class Relation {

  id: string;
  type: string;
  patientId: string;
  userId: string;

  constructor(json?) {
    if (json) {
      this.type = json.type;

     // this.id = json.id;
    //  this.patientId = json.patientId;
      this.userId = json.userId;
    }
  }
}
