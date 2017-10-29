import {InjectionToken, Provider} from '@angular/core';

export interface Environment {
  backendUrl: string;
  apiUrl: string;
  currentVersion: string;
  production: boolean;
  jwtToken: string;
  lastestUsedVersion: string;
  localstorage: { LOCALSTORAGE_SELECTEDLANG: string };
  privateImagesRegex: string;
  loadingImage: string;
  api: {
    getSignIn: string;
    getPatient: string;
    getAlbum: string;
    getStory: string;
    getAsset: string;
    getUser: string;
    invite: string;
  },
  temp: {
    albums: string;
    currentUser: string;
    currentPatient: string;
  },
  methods: {
    addNewStory: string;
    addYoutubeStory: string;
    replaceDescription: string;
    replaceImage: string;
  }
}

export const BACKEND: string = 'https://api.prisma.care';
export const API_URL: string = BACKEND + '/v1';
export const CURENT_VERSION: string = '0.3.2';

export const env: Environment = {
  backendUrl: BACKEND,
  apiUrl: API_URL,
  currentVersion: '0.3.2',
  production: false,
  jwtToken: 'id_token',
  lastestUsedVersion: 'version',
  localstorage: { LOCALSTORAGE_SELECTEDLANG: "langs" },
  privateImagesRegex: '/asset/',
  loadingImage: "assets/img/homePage/loading.png",
  api: {
    getSignIn: 'signin',
    getPatient: 'patient',
    getAlbum: 'album',
    getStory: 'story',
    getAsset: 'asset',
    getUser: 'user',
    invite: 'invite'
  },
  temp: {
    albums: "albums",
    currentUser: "user",
    currentPatient: "patient"
  },
  methods: {
    addNewStory: 'addNewStory',
    addYoutubeStory: 'addYoutubeStory',
    replaceDescription: 'replaceDescription',
    replaceImage: 'replaceImage'
  }
};


export const EnvironmentToken = new InjectionToken<Environment>('environment');
export const EnvironmentProvider: Provider = {
  provide: EnvironmentToken,
  useValue: env
};
