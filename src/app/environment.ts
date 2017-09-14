/**
 * Created by Jean on 10-07-17.
 */

export const BACKEND: string = 'https://api.prisma.care';
export const API_URL: string = BACKEND + '/v1';
export const CURENT_VERSION: string = '0.3.2';

export const env = {
  production: false,
  jwtToken: 'id_token',
  lastestUsedVersion: 'version',
  localstorage: {LOCALSTORAGE_SELECTEDLANG: "langs"},
  privateImagesRegex: '/asset/',
  loadingImage: "assets/img/homePage/loading.gif",
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
