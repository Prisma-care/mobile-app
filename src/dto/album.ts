import { UserStory } from './user-story';

export class Album {
  id: string;
  title: string;
  description: string;
  stories: UserStory[];
}
