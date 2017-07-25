import {UserStory} from "./user-story";

export class Album {

  id: string;
  title: string;
  description: string;
  stories: UserStory[] = [];

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.title = json.title;
    this.description = json.description;
    json.stories.forEach((story) => this.stories.push(new UserStory(story)));
  }

  isEmpty(): boolean {
    return this.stories.length === 0;
  }

  getBackgroundImage(i: number): string {
    if (this.stories[i]) {
      return this.stories[i].source || "";
    }
    else return "";
  }

}
