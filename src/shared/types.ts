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
  createAt: {date: string};
  updateAt: {date: string};
}

export class Album {
  id: string;
  patientId: number;
  title: string;
  description: string;
  stories: Story[] = [];
  hasNew: boolean;
}
