export class UserStory {
  id: string;
  albumId: number;
  description: string;
  title: string;
  happened_at: Date;
  creatorId: number; // heritage origin story
  favorited: boolean;
  source: string;
  type: string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.albumId = json.albumId;
    this.creatorId = json.creatorId || 1;
    this.description = json.description;
    this.source = json.source || json.assetSource;
    if (this.source)
      if (this.source.startsWith("https://api.prisma.care/storage/heritage/https"))
        this.source = this.source.replace("https://api.prisma.care/storage/heritage/https", "https");

    this.favorited = json.favorited || false;
    if (json.happened_at)
      this.happened_at = new Date(json.happened_at);
    this.type = json.type;
  }
}
