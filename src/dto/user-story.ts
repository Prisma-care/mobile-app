export class UserStory {
  id: string;
  albumId: number;
  description: string;
  title: string;
  happened_at: Date;
  creatorId: number; // heritage origin story
  favorited: boolean;
  source: string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.albumId = json.albumId;
    this.creatorId = json.creatorId;
    this.description = json.description;
    this.source = json.source;
    this.favorited = json.favorited;
    if (json.happened_at)
      this.happened_at = new Date(json.happened_at);
  }
}
