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

  getUserStory(userId: string, storyId: string): Observable<UserStory> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    return this._http.get(`${this._urlToApi}/${url}/${userId}/${storyUrl}/${storyId}`, {
      headers: this._head
    })
      .map(res => {
        return new UserStory(res.json().response);
      })
      .catch(err => this.handleError(err));
  }

  getUserStories(): Observable<UserStory[]> {
    return this._http.get("assets/json/stories.json", {
      headers: this._head
    }).map(res => {
      let userStories: UserStory[] = [];
      res.json().forEach(story => userStories.push(new UserStory(story)));
      return userStories;
    })
      .catch(error => this.handleError(error));
  }

  getAlbums(patientId: string | number): Observable<Album[]> {

    let url: string = env.api.getPatient;
    let albumUrl: string = env.api.getAlbum;
    return this._http.get(`${this._urlToApi}/${url}/${patientId}/${albumUrl}`, {
      headers: this._head
    })
      .map(res => {
        let albums: Album[] = [];
        res.json().response.forEach(album =>
          {
              /* probably not needed
            // fill in the stories
            album.stories.forEach(
              (story) => {
                this.getUserStory()
              }
            );
            */
            albums.push(new Album(album));
          }
        );
        return albums;
      })
      .catch(err => this.handleError(err));
  }

  getAlbum(patientId: string | number, albumId: string | number): Observable<Album> {
    let url: string = env.api.getPatient;
    let albumUrl: string = env.api.getAlbum;
    return this._http.get(`${this._urlToApi}/${url}/${patientId}/${albumUrl}/${albumId}`, {
      headers: this._head
    })
      .map(res => {
        return new Album(res.json().response);
      })
      .catch(err => this.handleError(err));
  }

  addAlbum(patientId: string | number, title: string): Observable<Album> {
    let url: string = env.api.getPatient;
    let albumUrl: string = env.api.getAlbum;
    return this._http.post(`${this._urlToApi}/${url}/${patientId}/${albumUrl}`, {title: title}, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          return null;
        }
        let albumContent = res.json();
        albumContent["title"] = title;
        // todo: description?
        return new Album(albumContent);
      }).catch(err => this.handleError(err));
  }


  oldAddStory(selectedAlbum: Album, newStory: UserStory): Observable<any> {
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

  addStory(userId: number, newStory: UserStory): Observable<UserStory> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    return this._http.post(`${this._urlToApi}/${url}/${userId}/${storyUrl}`, newStory, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          return null;
        }
        return new UserStory(res.json().response) as UserStory;
      }).catch(err => this.handleError(err));
  }

  postImage(image: File, userStory: UserStory): Observable<any> {
    let url: string = env.api.getPatient;
    return this._http.post(`${this._urlToApi}/${url}`, userStory, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          return null;
        }
        return new UserStory(res.json().response) as UserStory;
      }).catch(err => this.handleError(err));
  }

  generateBasicAlbums(patientId: string): Observable<Album[]> {
    let url: string = env.api.getPatient;
    let albumUrl: string = env.api.getAlbum;
    return this._http.get("assets/json/albums.json").map(res => {
      let albums: Album[] = res.json();
      let returnedAlbums: Album[] = [];
      if (!albums)
        return;
      albums.forEach(album => {
        this._http.post(`${this._urlToApi}/${url}/${patientId}/${albumUrl}`, album, {
          headers: this._head
        })
          .map(res => {
            // If request fails, throw an Error that will be caught
            if (res.status < 200 || res.status >= 300) {
              return null;
            }
            return new Album(res.json().response) as Album;
          }).toPromise().then(res2 => returnedAlbums.push(res2)).catch(err => this.handleError(err));
      });
      return returnedAlbums;
    }).catch(err => this.handleError(err));
  }

  /** Get historical themes (just albums for now) */
  getThemes(): Observable<Album[]> {
    return this._http.get("assets/json/themes.json", {
      headers: this._head
    }).map(res => {
      /*let albums: Album[] = [];
       res.json().forEach(album => albums.push(new Album(album)));
       return albums;*/
      return res.json() ? res.json() as Album[] : new Array<Album>();
    })
      .catch(error => this.handleError(error));
  }

  /** Get historical themes (just albums for now) */
  getLOLBUMS(): Observable<Album[]> {
    return this._http.get("assets/json/albums.json", {
      headers: this._head
    }).map(res => {
      /*let albums: Album[] = [];
       res.json().forEach(album => albums.push(new Album(album)));
       return albums;*/
     let albums: Album[] = [];
     res.json().forEach(album => albums.push(new Album(album)));
     return albums;
    })
      .catch(error => this.handleError(error));
  }


}
