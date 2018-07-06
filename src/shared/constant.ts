import {environment} from '../environments/environment';
import {Constant} from './types';

export const constant: Constant = {
  apiUrl: environment.apiUrl,
  tracking: environment.tracking,
  trackingExcluded: environment.trackingExcluded,
  currentEnv: environment.currentEnv,
  currentVersion: '0.3.2',
  youtubeApiKey: environment.youtubeApiKey,
  jwtToken: 'id_token',
  lastestUsedVersion: 'version',
  defaultUsername: environment.defaultUsername,
  defaultPassword: environment.defaultPassword,
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
    replaceImage: 'replaceImage',
    addFileStory: 'addFileStory'
  }
};
