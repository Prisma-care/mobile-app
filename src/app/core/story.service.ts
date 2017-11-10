
import { Inject, Injectable } from "@angular/core";
import { Observable, pipe } from "rxjs/Rx";
import { map, catchError } from 'rxjs/operators'
import { UserStory } from "../../dto/user-story";
import {
  background, getMessageFromBackendError, getThumbnails, getUrlImage, getYoutubeDescriptionAndThumbnail,
  youtubeId
} from "../utils";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Environment, EnvironmentToken } from "../environment";
import { Camera } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { File } from "@ionic-native/file";
import 'rxjs/add/operator/catch';

interface storyResponse {
  response: UserStory
}

interface storiesResponse {
  response: UserStory[]
}

@Injectable()
export class StoryService {

  storyMap = map(({ response }: storyResponse) => new UserStory(response))

  constructor( @Inject(EnvironmentToken) private env: Environment,
    private http: HttpClient,
    private camera: Camera,
    private filePath: FilePath,
    private file: File) {
    this.handleError = this.handleError.bind(this);
  }

  getUserStory(patientId: string, storyId: string): Observable<UserStory | Error> {
    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .pipe(
        this.storyMap,
        catchError(this.handleError)
      )
  }

  getUserStories(): Observable<UserStory[] | Error> {
    return this.http.get("assets/json/stories.json")
      .pipe(
        map(({ response }: storiesResponse) => response.map(story => new UserStory(story))),
        catchError(this.handleError)
      )
  }

  addStory(patientId: number, newStory: UserStory): Observable<UserStory | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}`, newStory)
      .pipe(
        this.storyMap,
        catchError(this.handleError)
      )
  }

  deleteStory(patientId: number, storyId: number): Observable<Object | Error> {
    return this.http.delete(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  updateStory(patientId: number, newStory: UserStory): Observable<UserStory | Error> {
    return this.http.patch(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${newStory.id}`, newStory)
      .pipe(
        this.storyMap,
        catchError(this.handleError)
      )
  }

  getImage(filename: string): Observable<string | Error> {
    return getUrlImage.call(this, filename)
  }

  getYoutubeId(url: string): string {
    return youtubeId(url)
  }

  getThumb(url): Observable<string> {
    return this.checkYoutubeLink(url).map((res: {thumbnail: string}) => {
      return res.thumbnail});
  }

  getBackground(story: UserStory): Observable<string | Error> {
    return background.call(this, story)
  }

  addYoutubeLinkAsset(patient_id: number, storyId: number, asset: string): Observable<Object | Error> {
    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patient_id}/${this.env.api.getStory}/${storyId}/${this.env.api.getAsset}`, {
      "asset": asset,
      "assetType": "youtube"
    })
    .pipe(
      catchError(this.handleError)
    )
  }

  takeAPicture(): Observable<string> {
    return this.getPicture(this.camera.PictureSourceType.CAMERA);
  }

  chooseAFile(): Observable<string> {
    return this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  getPicture(sourceType): Observable<string> {
    const options = {
      quality: 90,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    };

    return Observable.fromPromise(this.camera.getPicture(options))
  }

  validYoutubeLink(url):Boolean{
    const youtubeLinkRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/
    return url.toLowerCase().match(youtubeLinkRegex)
  }

  checkYoutubeLink(url: string): Observable<Object | Error> {
    return getYoutubeDescriptionAndThumbnail.call(this, url);
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
