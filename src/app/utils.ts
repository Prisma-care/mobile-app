import {Observable} from "rxjs/Observable";
import {UserStory} from "../dto/user-story";

export const getMessageFromBackendError = (message: string | { [key: string]: string[] } = '') => {
  if (typeof message === 'string') {
    return message;
  }

  return Object.keys(message).reduce((acc, next) => {
    return `${acc}
      ${message[next].join('\n')}
    `;
  }, '');
};


export function getUrlImage(filename: string): Observable<string | Error> {
  let header: Headers = new Headers({'Content-Type': 'image/jpg'});
  return this.http.get(`${filename}`, {
    header,
    responseType: 'blob'
  })
    .map(blob => URL.createObjectURL(blob))
    .catch(err => this.handleError(err));
};

export function background(story: UserStory): Observable<string | Error>{
  return Observable.of(story)
    .map(item => {
      if (item.type !== "youtube") {
        return this.getImage(item.source)
      } else {
        return Observable.of(this.getThumb(item.source))
      }
    })
    .switchMap(x => x)
}


export const getThumbnails = (url) => {
  if (!url) {
    return '';
  }
  let video = youtubeId(url)
  return 'http://img.youtube.com/vi/' + video + '/0.jpg';
};

export const youtubeId = (url: string): string => {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return '';
  }
}
