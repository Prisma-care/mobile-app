export interface Environment {
  currentEnv: string;
  tracking: boolean;
  trackingExcluded: string[];
  apiUrl: string;
  youtubeApiKey: string;
}

export const environment = {
  // See environment.ts in the root for more info.

  currentEnv: 'develop',
  tracking: false,

  // insert email addresses you want to exclude from
  // mixpanel tracking in your build here
  trackingExcluded: [],

  // insert a valid Prisma API URL
  apiUrl: 'XXX',

  // insert a valid YouTube API key
  youtubeApiKey: 'XXX'
};
