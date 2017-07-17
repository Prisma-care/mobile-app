import {UserStory} from "./user-story";

export class Album {

  id: string;
  title: string;
  description: string;
  stories: UserStory[]=[];

  constructor(json?) {
    if(!json)
      return;
    this.id = json.id;
    this.title = json.title;
    this.description = json.description;
    if(json.stories) // TODO: these are not full stories
     json.stories.push(story => new UserStory(story));
  }
}
