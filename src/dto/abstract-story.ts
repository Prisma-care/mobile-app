import { StoryType } from './enum/story-type';

export abstract class AbstractStory {
  id: string;
  type: StoryType;
  source: string;
  title: string;
  description: string;
  dateAdded: Date;
  dateHappened: Date;
}
