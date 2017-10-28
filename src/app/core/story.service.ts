
import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {UserStory} from "../../dto/user-story";
import {getMessageFromBackendError, getThumbnails, getUrlImage} from "../utils";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Environment, EnvironmentToken} from "../environment";

interface storyResponse {
  response:UserStory
}

interface storiesResponse {
  response:UserStory[]
}

@Injectable()
export class StoryService {
  constructor(@Inject(EnvironmentToken) private env: Environment,
              private http: HttpClient) {
    this.handleError = this.handleError.bind(this);
  }

  getUserStory(patientId: string, storyId: string): Observable<UserStory | Error> {

    return this.http.get(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .map(({response}:storyResponse) => new UserStory(response))
      .catch(err => this.handleError(err));
  }

  getUserStories(): Observable<UserStory[]| Error >  {
    return this.http.get("assets/json/stories.json")
      .map(({response}:storiesResponse) => response.map(story => new UserStory(story)))
      .catch(error => this.handleError(error));
  }

  addStory(patientId: number, newStory: UserStory): Observable<UserStory| Error >  {

    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}`,newStory)
      .map(({response}:storyResponse) =>  new UserStory(response))
      .catch(err => this.handleError(err));
  }

  deleteStory(patientId: number, storyId: number): Observable<boolean| Error >  {
    return this.http.delete(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${storyId}`)
      .catch(err => this.handleError(err));
  }

  updateStory(patientId: number, newStory: UserStory): Observable<UserStory| Error >  {
    return this.http.patch(`${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${this.env.api.getStory}/${newStory.id}`, newStory)
      .map(({response}:storyResponse) => new UserStory(response))
      .catch(err => this.handleError(err));
  }

  getImage(filename: string): Observable<string| Error >  {
    return getUrlImage.call(this, filename)
  }

  getThumb(url):string{
    return getThumbnails(url);
  }

  addYoutubeLinkAsset(patient_id: string, storyId: string, asset: string):Observable<Boolean|Error> {

    return this.http.post(`${this.env.apiUrl}/${this.env.api.getPatient}/${patient_id}/${this.env.api.getStory}/${storyId}/${this.env.api.getAsset}`, {
      "asset": asset,
      "assetType": "youtube"
    })
      .catch(err => this.handleError(err));

  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(new Error(
      `${getMessageFromBackendError(err.error && err.error.meta && err.error.meta.message)}
      `));
  }
}
