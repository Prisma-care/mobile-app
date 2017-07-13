import {PrismaService} from "./prisma-api.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";

@Injectable()
export class StoryService extends PrismaService {

  getUserStory(id: string): Observable<UserStory> {
    return this.getUserStories()
      .map(stories => {
        let s = stories.find(story => story.id == id);
        return s ? new UserStory(s) : new UserStory();
      });
  }

  getUserStories(): Observable<UserStory[]> {
    return this._http.get("assets/json/stories.json").map(res => {
      let userStories: UserStory[] = [];
      res.json().forEach(story => userStories.push(new UserStory(story)));
      return userStories;
    })
      .catch(error => this.handleError(error));
  }

  getAlbums(): Observable<Album[]> {
    return this._http.get("assets/json/albums.json").map(res => {
      /*let albums: Album[] = [];
       res.json().forEach(album => albums.push(new Album(album)));
       return albums;*/
      return res.json() ? res.json() as Album[] : new Array<Album>();
    })
      .catch(error => this.handleError(error));
  }

  /** Get historical themes (just albums for now) */
  getThemes(): Observable<Album[]> {
    return this._http.get("assets/json/themes.json").map(res => {
      /*let albums: Album[] = [];
       res.json().forEach(album => albums.push(new Album(album)));
       return albums;*/
      return res.json() ? res.json() as Album[] : new Array<Album>();
    })
      .catch(error => this.handleError(error));
  }
}
