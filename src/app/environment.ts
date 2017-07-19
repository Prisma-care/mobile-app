/**
 * Created by Jean on 10-07-17.
 */

export const BACKEND: string = 'http://146.185.145.169';
export const API_URL: string = BACKEND + '/api/v1';


export const env = {
  production: false,
  jwtToken: 'id_token',
  localstorage: {
  },
  api: {
    getPatient: 'patient',
    getAlbum: 'album',
    getStory: 'story',
    getAsset: 'asset'
  },
  temp: {
    albums:"albums"
  }
};
