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

  //For demo prupose !!!
  public static fakeStory1: UserStory;
  public static fakeStory2: UserStory;
  public static fakeStory3: UserStory;

  getUserStory(patientId: string, storyId: string): Observable<UserStory> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    //For demo prupose !!!
    if (storyId.indexOf("2000") >= 0)
      return Observable.of(StoryService.fakeStory1);
    if (storyId.indexOf("2001") >= 0)
      return Observable.of(StoryService.fakeStory2);
    if (storyId.indexOf("2002") >= 0)
      return Observable.of(StoryService.fakeStory3);
    return this._http.get(`${this._urlToApi}/${url}/${patientId}/${storyUrl}/${storyId}`, {
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
        res.json().response.forEach(album => {
            /* probably not needed
             // fill in the stories
             album.stories.forEach(
             (story) => {
             this.getUserStory()
             }
             );
             */
            let al: Album = new Album(album);
            albums.push(this.setYoutubeVideoExemple(al));
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
        let al: Album = new Album(res.json().response);
        return this.setYoutubeVideoExemple(al);
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

  addStory(patientId: number, newStory: UserStory): Observable<UserStory> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    return this._http.post(`${this._urlToApi}/${url}/${patientId}/${storyUrl}`, newStory, {
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

  deleteStory(patientId: number, storyId: number): Observable<boolean> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    return this._http.delete(`${this._urlToApi}/${url}/${patientId}/${storyUrl}/${storyId}`, {
      headers: this._head
    })
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          return false;
        }
        return true;
      }).catch(err => this.handleError(err));
  }

  updateStory(patientId: number, newStory: UserStory): Observable<UserStory> {
    let url: string = env.api.getPatient;
    let storyUrl: string = env.api.getStory;
    return this._http.patch(`${this._urlToApi}/${url}/${patientId}/${storyUrl}/${newStory.id}`, newStory, {
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




//For demo prupose !!!
  setYoutubeVideoExemple(al: Album): Album {
    if (al.title.toLowerCase().indexOf("vrije tijd") >= 0) {
      if (!StoryService.fakeStory1) {
        let fakeStory: UserStory = new UserStory();
        fakeStory.title = "The 3 tenors";
        fakeStory.favorited = true;
        fakeStory.description = "Youtube video";
        fakeStory.creatorId = 1;
        fakeStory.id = "2000";
        fakeStory.source = "https://www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0?ecver=1&start=45";
        StoryService.fakeStory1 = fakeStory;
      }
      al.stories.push(StoryService.fakeStory1);
    }

    if (al.title.toLowerCase().indexOf("kindert") >= 0) {
      if (!StoryService.fakeStory2) {
        let fakeStory: UserStory = new UserStory();
        fakeStory.title = "Eviva España";
        fakeStory.favorited = true;
        fakeStory.description = "Samantha - Eviva España (Tienerklanken, 1972)";
        fakeStory.creatorId = 1;
        fakeStory.id = "2001";
        fakeStory.source = "https://www.youtube.com/embed/mLWSnAZh32o?rel=0&amp;showinfo=0?ecver=1";
        StoryService.fakeStory2 = fakeStory;
      }
      al.stories.push(StoryService.fakeStory2);
    }

    if (al.title.toLowerCase().indexOf("sport") >= 0) {
      if (!StoryService.fakeStory3) {
        let fakeStory: UserStory = new UserStory();
        fakeStory.title = "Paul Van Himst";
        fakeStory.favorited = true;
        fakeStory.description = "Paul Van Himst vs Arsenal Finale Coppa delle Fiere 1969 1970";
        fakeStory.creatorId = 1;
        fakeStory.id = "2002";
        fakeStory.source = "https://www.youtube.com/embed/hE2eO-LwZps?rel=0&amp;showinfo=0?ecver=1&start=10";
        StoryService.fakeStory3 = fakeStory;
      }
      al.stories.push(StoryService.fakeStory3);
    }
    return al;
  }
}
