export class Category {
  id: string;
  name: string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.name = json.name;
  }
}
