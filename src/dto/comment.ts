export class Comment {
  id: string;
  storyId: string;
  userId: string;
  comment: string;


  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.storyId = json.storyId;
    this.userId = json.userId;
    this.comment = json.comment;
  }
}
