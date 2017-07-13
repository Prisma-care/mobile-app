import { AbstractStory } from './abstract-story';

export class UserStory extends AbstractStory {
    albumId: string;
    originId: string; // heritage origin story


  constructor(json?) {
    super(json);
    if(!json)
      return;
    this.albumId = json.albumId;
    this.originId = json.originId;
  }
}
