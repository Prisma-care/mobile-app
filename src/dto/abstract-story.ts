import {StoryType} from "./enum/story-type";
import {Category} from "./category";
import {Comment} from "./comment";

export abstract class AbstractStory {
  id: string;
  type: StoryType;
  source: string;
  title: string;
  description: string;
  dateAdded: Date;
  dateHappened: Date;
  likes: string[]; // userId's
  comments: Comment[] = [];
  categories: Category[] = [];


  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.type = json.type;
    this.source = json.source;
    this.title = json.title;
    this.description = json.description;
    this.dateAdded = new Date(json.dateAdded);
    this.dateHappened = new Date(json.dateHappened);
    this.likes = json.likes;
    if (json.comments)
      json.comments.forEach(comment =>     this.comments.push(new Comment(comment)));
    if (json.categories)
      json.categories.forEach(category =>   this.categories.push(new Category(category)));
  }
}
