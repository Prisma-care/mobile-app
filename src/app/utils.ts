import {Observable} from "rxjs/Observable";

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


export function getUrlImage (filename: string):Observable<string| Error > {
  let header: Headers = new Headers({'Content-Type': 'image/jpg'});
  return this.http.get(`${filename}`,{
    header,
    responseType:'blob'
  })
    .map(blob => URL.createObjectURL(blob))
    .catch(err => this.handleError(err));
};


export const getThumbnails = (url) => {
  if (!url) {
    return '';
  }
  let results = url.match('[\\?&]v=([^&#]*)');
  let video = (results === null) ? '' : results[1];
  return 'http://img.youtube.com/vi/' + video + '/0.jpg';
};
