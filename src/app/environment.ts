import {InjectionToken, Provider} from '@angular/core';

export interface Environment {
  backendUrl: string;
  apiUrl: string;
  currentVersion: string;
  production: boolean;
  youtubeApiKey: string;
  jwtToken: string;
  lastestUsedVersion: string;
  localstorage: {LOCALSTORAGE_SELECTEDLANG: string};
  privateImagesRegex: string;
  loadingImage: string;
  emptyAlbum: string;
  supportMailAddress: string;
  api: {
    getSignIn: string;
    getPatient: string;
    getAlbum: string;
    getStory: string;
    getAsset: string;
    getUser: string;
    invite: string;
  };
  temp: {
    albums: string;
    currentUser: string;
    currentPatient: string;
  };
  methods: {
    addNewStory: string;
    addYoutubeStory: string;
    replaceDescription: string;
    replaceImage: string;
  };
}

export const env: Environment = {
  backendUrl: 'https://api.prisma.care',
  apiUrl: 'https://api.prisma.care/v1',
  currentVersion: '0.3.2',
  production: false,
  youtubeApiKey: 'AIzaSyBGA18_O8NWLDbu2nRPRc_FRMcK0DTQs80',
  jwtToken: 'id_token',
  lastestUsedVersion: 'version',
  localstorage: {LOCALSTORAGE_SELECTEDLANG: 'langs'},
  privateImagesRegex: '/asset/',
  loadingImage: 'assets/img/homePage/loading.png',
  emptyAlbum: 'assets/img/empty-album.png',
  supportMailAddress: 'info@prisma.care',
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
    albums: 'albums',
    currentUser: 'user',
    currentPatient: 'patient'
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
