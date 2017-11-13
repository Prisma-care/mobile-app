import {Inject, Injectable} from '@angular/core';
import {Observable, pipe} from 'rxjs/Rx';
import {map, catchError} from 'rxjs/operators';
import {Story} from '../../shared/types';
import {
  background,
  getMessageFromBackendError,
  getUrlImage,
  getYoutubeDescriptionAndThumbnail,
  youtubeId
} from '../../shared/utils';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Environment, EnvironmentToken} from '../environment';
import {Camera} from '@ionic-native/camera';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';

interface StoryResponse {
  response: Story;
}

interface StoriesResponse {
  response: Story[];
}

@Injectable()
export class StoryService {
  storyPipe = pipe(
    map(({response}: StoryResponse) => response as Story),
    catchError(this.handleError)
  );

  constructor(
    @Inject(EnvironmentToken) private env: Environment,
    private http: HttpClient,
    private camera: Camera
  ) {
    this.handleError = this.handleError.bind(this);
  }

  getUserStory(patientId: string, storyId: string): Observable<Story | Error> {
    return this.http
      .get(
        `${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${
          this.env.api.getStory
        }/${storyId}`
      )
      .let(this.storyPipe);
  }

  getUserStories(): Observable<Story[] | Error> {
    return this.http
      .get('assets/json/stories.json')
      .pipe(
        map(({response}: StoriesResponse) =>
          response.map(story => story as Story)
        ),
        catchError(this.handleError)
      );
  }

  addStory(patientId: number, newStory: Story): Observable<Story | Error> {
    return this.http
      .post(
        `${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${
          this.env.api.getStory
        }`,
        newStory
      )
      .let(this.storyPipe);
  }

  deleteStory(patientId: number, storyId: number): Observable<Object | Error> {
    return this.http
      .delete(
        `${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${
          this.env.api.getStory
        }/${storyId}`
      )
      .pipe(catchError(this.handleError));
  }

  updateStory(patientId: number, newStory: Story): Observable<Story | Error> {
    return this.http
      .patch(
        `${this.env.apiUrl}/${this.env.api.getPatient}/${patientId}/${
          this.env.api.getStory
        }/${newStory.id}`,
        newStory
      )
      .let(this.storyPipe);
  }

  getImage(filename: string): Observable<string | Error> {
    return getUrlImage.call(this, filename);
  }

  getYoutubeId(url: string): string {
    return youtubeId(url);
  }

  getThumb(url): Observable<string> {
    return this.checkYoutubeLink(url).map((res: {thumbnail: string}) => {
      return res.thumbnail;
    });
  }

  getBackground(story: Story): Observable<string | Error> {
    return background.call(this, story);
  }

  addYoutubeLinkAsset(
    patient_id: number,
    storyId: number,
    asset: string
  ): Observable<Object | Error> {
    return this.http
      .post(
        `${this.env.apiUrl}/${this.env.api.getPatient}/${patient_id}/${
          this.env.api.getStory
        }/${storyId}/${this.env.api.getAsset}`,
        {
          asset: asset,
          assetType: 'youtube'
        }
      )
      .pipe(catchError(this.handleError));
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

    return Observable.fromPromise(this.camera.getPicture(options));
  }

  checkYoutubeLink(url: string): Observable<Object | Error> {
    return getYoutubeDescriptionAndThumbnail.call(this, url);
  }

  handleError(err: HttpErrorResponse): Observable<Error> {
    return Observable.of(
      new Error(
        `${getMessageFromBackendError(
          err.error && err.error.meta && err.error.meta.message
        )}
      `
      )
    );
  }
}
