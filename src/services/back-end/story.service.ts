import { PrismaService } from "./prisma-api.service";
import { Observable } from "rxjs/Observable";
import { User } from "../../dto/user";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Subscription} from 'rxjs/Subscription';
import { Injectable } from "@angular/core";
import {UserStory} from "../../dto/user-story";

@Injectable()
export class StoryService extends PrismaService {


  getUserStories(userId: string): Observable<UserStory[]> {
    return this._http.get("/mock-api/stories.json").map(res => {
      console.log("look here  2" + JSON.stringify(res.json()));
        let userStories:UserStory[] = [];
        res.json().forEach(story =>
      {
        userStories.push(new UserStory(story));
      })
        return userStories;
      })
      .catch(error => this.handleError(error));
  }
}
