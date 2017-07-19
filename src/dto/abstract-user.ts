export abstract class AbstractUser {

  // personal info
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  birthPlace: string;

  // profile picture
  location: string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.dateOfBirth = new Date(json.dateOfBirth);
    this.birthPlace = json.birthPlace;
    this.location = json.location;
  }

  getThumbnail(): string {
    return this.location; // TODO: derive thumbnail link
  }

  /** Gets the age of the user */
  getAge(): number {
    // this can be derived from the dateOfBirth
    return 1; // TODO: with moment.js
  }

}
