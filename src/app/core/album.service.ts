import { Inject, Injectable } from "@angular/core";
import { Environment, EnvironmentToken } from "../environment";
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import {
  background, getMessageFromBackendError, getUrlImage,
  getYoutubeDescriptionAndThumbnail
} from "../../shared/utils";
import { Observable, pipe } from "rxjs/Rx";
import { map, catchError } from 'rxjs/operators';
import { UserStory } from "../../dto/user-story";
import { Album } from "../../dto/album";

interface AlbumsResponse {
  response: Album[]
}

interface AlbumResponse {
  response: Album
}

@Injectable()
export class AlbumService {

  albumPipe = pipe(
    map(({ response }: AlbumResponse) => new Album(response)),
    catchError(this.handleError)
  )

  constructor( @Inject(EnvironmentToken) private env: Environment,
    private http: HttpClient) {
    this.handleError = this.handleError.bind(this);
  }

  getAlbums(patientId: string | number): Observable<Album[] | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}`)
      .pipe(
        map(({ response }: AlbumsResponse) => response.reduce((acc, it) => [...acc, new Album(it)], [])),
        catchError(this.handleError)
      )
  }

  getAlbum(patientId: string | number, albumId: string | number): Observable<Album | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}/${albumId}`)
      .let(this.albumPipe)
    }

  deleteAlbum(patientId: string | number, albumId: string | number): Observable<Object | Error> {
    return this.http.delete(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}/${albumId}`)
      .pipe(
        catchError(this.handleError)
      )
  }


  addAlbum(patientId: string | number, title: string): Observable<Album | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getAlbum}`, { title: title })
      .let(this.albumPipe)
  }

  getImage(filename: string): Observable<string | Error> {
    return getUrlImage.call(this, filename)
  }

  getThumb(url): Observable<string> {
    return this.checkYoutubeLink(url)
      .pipe(
        map((res: { thumbnail: string }) => res.thumbnail)
      )
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
