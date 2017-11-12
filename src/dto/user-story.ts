export class UserStory {
  id: number;
  albumId: number;
  description: string;
  title: string;
  happened_at: Date;
  creatorId: number; // heritage origin story
  favorited: boolean;
  backgroundImage: any;
  source: string;
  type: string;
}
