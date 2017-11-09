import {Inject, Injectable} from "@angular/core";
import {Environment, EnvironmentToken} from "../environment";
import {HttpClient} from "@angular/common/http";
import {HttpErrorResponse} from "@angular/common/http";
import {
  background, getMessageFromBackendError, getUrlImage,
  getYoutubeDescriptionAndThumbnail
} from "../utils";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/of";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";

interface AlbumsResponse {
  response: Album[]
}

interface AlbumResponse {
  response: Album
}

@Injectable()
export class AlbumService {

  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {
    this.handleError = this.handleError.bind(this);
  }

  getAlbums(patientId: string | number): Observable<Album[] | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}`)
      .map(({response}: AlbumsResponse) => response.reduce((acc, it) => [...acc, new Album(it)], []))
      .catch(err => this.handleError(err));
  }

  getAlbum(patientId: string | number, albumId: string | number): Observable<Album | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}/${albumId}`)
      .map(({response}: AlbumResponse) => new Album(response))
      .catch(err => this.handleError(err));
  }

  deleteAlbum(patientId: string | number, albumId: string | number): Observable<Object | Error> {
    return this.http.delete(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}/${albumId}`)
      .catch(err => this.handleError(err));
  }


  addAlbum(patientId: string | number, title: string): Observable<Album | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}`, {title: title})
      .map(({response}: AlbumResponse) => new Album(response))
      .catch(err => this.handleError(err));
  }

  getImage(filename: string): Observable<string | Error> {
    return getUrlImage.call(this, filename)
  }

  getThumb(url): Observable<string> {
    return this.checkYoutubeLink(url)
      .map((res: { thumbnail: string }) => {
        return res.thumbnail
      });
  }

  checkYoutubeLink(url: string): Observable<Object | Error> {
    return getYoutubeDescriptionAndThumbnail.call(this, url);
  }

  getBackground(story: UserStory) {
    return background.call(this, story)
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
