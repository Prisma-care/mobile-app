export interface Environment {
  currentEnv: string;
  tracking: boolean;
  trackingExcluded: string[];
  apiUrl: string;
  youtubeApiKey: string;
}

export const environment = {
  // These statements are preprocessed by gulp
  // eg. run 'gulp develop' to export this part as the environment.

  currentEnv: 'develop',
  tracking: false,

  // insert email addresses you want to exclude from
  // mixpanel tracking in your build here
  trackingExcluded: [],

  // insert a valid Prisma API URL
  apiUrl: 'XXXXX',

  // insert a valid YouTube API key
  youtubeApiKey: 'XXXXX'
};
