import { StoryType } from './enum/story-type';
import {Category} from "./category";

export abstract class AbstractStory {
  id: string;
  type: StoryType;
  source: string;
  title: string;
  description: string;
  dateAdded: Date;
  dateHappened: Date;
  likes: string[]; // userId's
  comments: Comment[];
  categories: Category[];
}
