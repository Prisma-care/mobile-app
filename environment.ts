export interface Environment {
  apiUrl: string;
  tracking: boolean;
  youtubeApiKey: string;
}

export const environment = {
  // @if ENV == 'develop'
  tracking: false,
  // @endif
  // @if ENV = 'production'
  tracking: true,
  // @endif
  apiUrl: 'XXXXX',
  youtubeApiKey: 'XXXXX'
};
