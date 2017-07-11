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


  constructor(json?){
    this.id = json.id;
    this.type = json.type;
    this.source = json.source;
    this.title = json.title;
    this.description = json.description;
    this.dateAdded = json.dateAdded;
    this.dateHappened = json.dateHappened;
    this.likes = json.likes;
    this.comments = json.comments;
    this.categories = json.categories;
  }
}
