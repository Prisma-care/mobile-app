import {PrismaService} from "./prisma-api.service";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {env} from "../../app/environment";

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
      let albums: Album[];
      let hasAlbums: boolean = false;
      this.storage.get(env.temp.albums).then((val) => {
        albums = JSON.parse(val) as Album[];
        if(albums)
          hasAlbums = true;
      });
      if (!hasAlbums) {
        albums = res.json() ? res.json() as Album[] : [];
        this.storage.set(env.temp.albums, JSON.stringify(res.json() as Album[])).then(
          val => albums = val ? val as Album[] : []
        )
      }
      console.log("Albums " + hasAlbums + " : " + JSON.stringify(albums));
      return albums;
    })
      .catch(error => this.handleError(error));
  }

  addStory(selectedAlbum: Album, newStory: UserStory): Observable<boolean> {
    return new Observable((value) => {
      this.storage.get(env.temp.albums).then((val) => {
        let currentAlbums: Album[] = JSON.parse(val) as Album[] || [];
        let isANewAlbum: boolean = true;
        currentAlbums.forEach(album => {
          if (album.id === selectedAlbum.id) {
            isANewAlbum = false;
            newStory.id = album.stories[album.stories.length - 1].id + 1;
            album.stories.push(newStory);
          }
        });
        if (isANewAlbum) {
          newStory.id = "1";
          selectedAlbum.stories.push(newStory);
          currentAlbums.push(selectedAlbum);
        }
        this.storage.set(env.temp.albums, JSON.stringify(currentAlbums)).then(
          val => console.log("Done : " + val)
        );
        ;
        return true;
      })
    })
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
