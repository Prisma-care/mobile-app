import {AbstractStory} from './abstract-story';

export class UserStory {
  id:string;
  creatorId: number; // heritage origin story
  albumId: number;
  description: string;
  source:string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.albumId = json.albumId;
    this.creatorId = json.creatorId;
    this.description =json.description;
    this.source = json.source;
  }
}
