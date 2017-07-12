export class WorkPlace {

  title: string;
  company: string;
  location: string;
  period: Date;

  constructor(json?) {
    if(!json)
      return;
    this.title = json.title;
    this.company = json.company; // TODO: not in spec yet
    this.location = json.location;
    this.period = new Date(json.period);
  }
}
