export class Relation {

  id: string;
  type: string;
  patientId: string;
  userId: string;

  constructor(json?) {
    if (json) {
      this.type = json.type;
      this.patientId = json.patientId;
      this.userId = json.userId;
    }
  }
}
