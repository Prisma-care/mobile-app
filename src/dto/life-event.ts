export class LifeEvent {
  id: string;
  userId: string;
  withUser: string;
  name: string;
  date: Date;
  storyId: string;


  constructor(json?) {
    if(!json)
      return;
    this.id = json.id;
    this.userId = json.userId;
    this.withUser = json.withUser;
    this.name = json.name;
    this.date = new Date(json.date);
    this.storyId = json.storyId;
  }
}
