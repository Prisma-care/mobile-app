import {Observable} from 'rxjs/Rx';
import {Story} from '../shared/types';
import {map, switchMap, catchError} from 'rxjs/operators';

export interface YoutubeResponse {
  items: {
    0: {
      snippet: {
        thumbnails: {
          default: {
            url: string;
          };
          medium: {
            url: string;
          };
          high: {
            url: string;
          };
          standard: {
            url: string;
          };
        };
        description: string;
        title: string;
      };
    };
  };
  pageInfo: {
    totalResults: number;
  };
}

export const getMessageFromBackendError = (
  message: string | {[key: string]: string[]} = ''
) => {
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
  const header: Headers = new Headers({'Content-Type': 'image/jpg'});
  return this.http
    .get(`${filename}`, {
      header,
      responseType: 'blob'
    })
    .pipe(map(blob => URL.createObjectURL(blob)), catchError(this.handleError));
}

export function background(story: Story): Observable<string | Error> {
  return Observable.of(story).pipe(
    map((item: Story) => {
      if (item.type === 'image') {
        return this.getImage(item.source);
      } else if (item.type === 'youtube') {
        return this.getThumb(item.source);
      } else {
        // probably text
        return Observable.of(
          new Error('story type does not have a background image')
        );
      }
    }),
    switchMap((x: Observable<string | Error>) => x)
  );
}

export const youtubeId = (url: string): string => {
  const regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/;
  const match = url.match(regExp);

  if (match && match[5].length === 11) {
    return match[5];
  } else {
    return '';
  }
};

export const validYoutubeLink = (url): Boolean => {
  const youtubeLinkRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/;
  return url.toLowerCase().match(youtubeLinkRegex);
};

export function getYoutubeDescriptionAndThumbnail(
  url: string
): Observable<Object | null> {
  if (validYoutubeLink(url)) {
    const urlId = youtubeId(url);

    return this.http
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${urlId}&key=${
          this.constant.youtubeApiKey
        }&part=snippet`
      )
      .pipe(
        map((res: YoutubeResponse) => ({
          // TODO: YT description not used anymore, but might be useful at some point
          thumbnail: res.pageInfo.totalResults
            ? res.items[0].snippet.thumbnails
            : null,
          description: res.items[0].snippet.description,
          title: res.items[0].snippet.title
        })),
        map((res: {thumbnail: Object; description: string; title: string}) => {
          const last = Object.keys(res.thumbnail)[
            Object.keys(res.thumbnail).length - 1
          ];
          return {...res, thumbnail: res.thumbnail[last].url};
        }),
        catchError(() => Observable.of(null))
      );
  } else {
    return Observable.of(null);
  }
}
