export class WorkPlace {

  job: string;
  location: string;
  period: Date;


  constructor(json?) {
    if(!json)
      return;
    this.job = json.job;
    this.location = json.location;
    this.period = new Date(json.period);
  }
}
