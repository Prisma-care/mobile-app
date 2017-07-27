/**
 * Created by Jean on 10-07-17.
 */

export const BACKEND: string = 'https://api.prisma.care';
export const API_URL: string = BACKEND + '/v1';


export const env = {
  production: false,
  jwtToken: 'id_token',
  localstorage: {},
  api: {
    getSignIn: 'signin',
    getPatient: 'patient',
    getAlbum: 'album',
    getStory: 'story',
    getAsset: 'asset',
    getUser: 'user'
  },
  temp: {
    albums: "albums",
    fakeUser: "user",
    fakePatient: "patient"
  },
  methods: {
    addNewStory: 'addNewStory',
    replaceDescription: 'replaceDescription',
    replaceImage: 'replaceImage'
  }
};
