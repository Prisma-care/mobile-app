import {Observable} from "rxjs/Observable";
import {UserStory} from "../dto/user-story";

export interface youtubeResponse {
  items: {
    0: {
      snippet: {
        thumbnails: {
          default: {
            url: string
          },
          medium: {
            url: string
          },
          high: {
            url: string
          },
          standard: {
            url: string
          }
        },
        description: string,
      }
    }
  }
  pageInfo: {
    totalResults: number
  }
}

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
}

export function background(story: UserStory): Observable<string | Error>{
  return Observable.of(story)
    .map(item => {
      if (item.type !== "youtube") {
        return this.getImage(item.source)
      } else {
        return this.getThumb(item.source)
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
  const regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/;
  const match = url.match(regExp);

  if (match && match[5].length == 11) {
    return match[5];
  } else {
    return '';
  }
};

export const validYoutubeLink = (url):Boolean =>{
  const youtubeLinkRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/
  return url.toLowerCase().match(youtubeLinkRegex)
};


export function getYoutubeDescriptionAndThumbnail(url): Observable<Object | Error>{
  if (validYoutubeLink(url)) {
    const urlId = youtubeId(url);

    return this.http.get(`https://www.googleapis.com/youtube/v3/videos?id=${urlId}&key=${this.env.youtubeApiKey}&part=snippet`)
      .map((res: youtubeResponse) => ({
        thumbnail : res.pageInfo.totalResults ? res.items[0].snippet.thumbnails :  null,
        description: res.items[0].snippet.description
      }))
      .map((res) => {
        const last = Object.keys(res.thumbnail)[Object.keys(res.thumbnail).length-1];
        return {...res, thumbnail: res.thumbnail[last].url}
      })
      .catch(() => {
        return Observable.of({})
      })
  } else {
    return Observable.of(null)
  }
}
