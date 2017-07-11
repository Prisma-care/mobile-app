export abstract class AbstractUser {

  // personal info
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  birthLocation: string;

  // profile picture
  profilePicture: string;

  constructor(json?) {
    if (json) {
      this.firstName = json.firstName;
      this.lastName = json.lastName;
      this.dateOfBirth = new Date(json.dateOfBirth);
      this.birthLocation = json.birthLocation;
      this.profilePicture = json.profilePicture;
    }
  }

  getThumbnail(): string {
    return this.profilePicture; // TODO: derive thumbnail link
  }

  /** Gets the age of the user */
  getAge(): number {
    // this can be derived from the dateOfBirth
    return 1; // TODO: with moment.js
  }

}
