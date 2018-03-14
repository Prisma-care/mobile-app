export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export class UserRegister extends User {
  password: string;
}

export class Patient {
  patient_id: number;
  firstName: string;
  lastName: string;
}

export class Story {
  id: number;
  userId: number;
  description: string;
  title: string;
  favorited: boolean;
  isHeritage: boolean;
  source: string;
  backgroundImage: string;
  type: string;
  createdAt: {date: string};
  updatedAt: {date: string};
}

export class Album {
  id: string;
  patientId: number;
  title: string;
  description: string;
  stories: Story[] = [];
  hasNew: boolean;
}

export interface Constant {
  apiUrl: string;
  tracking: boolean;
  trackingExcluded: string[];
  currentEnv: string;
  currentVersion: string;
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
    addFileStory: string;
  };
}
