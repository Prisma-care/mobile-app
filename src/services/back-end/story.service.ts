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
      let albums: Album[];
      let hasAlbums: boolean = false;
      albums = JSON.parse(localStorage.getItem(env.temp.albums)) as Album[];
      if (albums)
        hasAlbums = true;
      if (!hasAlbums) {
        albums = res.json() ? res.json() as Album[] : [];
        let temp: Album[] = []
        albums.forEach(album => {
          album.stories = [];
          temp.push(album);
        });
        localStorage.setItem(env.temp.albums, JSON.stringify(albums));
      }
      return albums;
    })
      .catch(error => this.handleError(error));
  }

  addStory(selectedAlbum: Album, newStory: UserStory): Observable<any> {
    let currentAlbums: Album[] = JSON.parse(localStorage.getItem(env.temp.albums)) as Album[] || [];

    console.log("Before \n" + JSON.stringify(JSON.parse(localStorage.getItem(env.temp.albums)) as Album[]));
    let isANewAlbum: boolean = true;
    currentAlbums.forEach(album => {
      if (album.id === selectedAlbum.id) {
        isANewAlbum = false;
        if (album.stories.length === 0) {
          album.stories = [];
          newStory.id = "1";
        }
        else {
          newStory.id = album.stories[album.stories.length - 1].id + 1;
        }
        album.stories.push(newStory);
      }
    });
    if (isANewAlbum) {
      newStory.id = "1";
      selectedAlbum = new Album();
      selectedAlbum.title = "Random";
      selectedAlbum.id = "RandomId";
      selectedAlbum.stories.push(newStory);
      currentAlbums.push(selectedAlbum);
    }
    localStorage.setItem(env.temp.albums, JSON.stringify(currentAlbums as Album[]));
    console.log("After \n" + JSON.stringify(JSON.parse(localStorage.getItem(env.temp.albums)) as Album[]));
    return Observable.of(true);

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
