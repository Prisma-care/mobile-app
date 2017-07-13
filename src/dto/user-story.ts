import { AbstractStory } from './abstract-story';

export class UserStory extends AbstractStory {
    albumId: string;
    originId: string; // heritage origin story
    date: Date;


  constructor(json?) {
    super(json);
    this.albumId = json.albumId;
    this.originId = json.originId;
    this.date = new Date(json.date);
  }
}
