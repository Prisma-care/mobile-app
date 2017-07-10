export abstract class AbstractUser {
  // personal info
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  birthLocation: string;

  // profile picture
  profilePicture: string;
  getThumbnail(): string {
    return this.profilePicture; // TODO: derive thumbnail link
  }

  /** Gets the age of the user */
  getAge(): number {
    // this can be derived from the dateOfBirth
    return 1; // TODO: with moment.js
  }

}
