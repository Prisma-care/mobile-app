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
  return this.http.get(`${filename}`,{
    responseType:'blob'
  })
    .map(blob => URL.createObjectURL(blob))
    .catch(err => this.handleError(err));
};
