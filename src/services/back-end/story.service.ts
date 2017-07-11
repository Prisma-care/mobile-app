import { PrismaService } from "./prisma-api.service";
import { Observable } from "rxjs/Observable";
import { User } from "../../dto/user";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import { Injectable } from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";

@Injectable()
export class StoryService extends PrismaService {

  getUserStory(id: string): Observable<UserStory> {
    return this.getUserStories()
      .map(stories => {
        let s = stories.find(story => story.id == id);
        console.log(" s is " + JSON.stringify(s) + " type is " + typeof(s));
        return s ? new UserStory(s) : new UserStory();
      });
  }

  getUserStories(): Observable<UserStory[]> {
    return this._http.get("/mock-api/stories.json").map(res => {
        let userStories:UserStory[] = [];
        res.json().forEach(story =>
      {
        userStories.push(new UserStory(story));
      })
        return userStories;
      })
      .catch(error => this.handleError(error));
  }

  getAlbums(): Observable<Album[]> {
    return this._http.get("/mock-api/albums.json").map(res => {
        return res.json() ? res.json() as Album[] : new Array<Album>();
      })
      .catch(error => this.handleError(error));
  }
}
