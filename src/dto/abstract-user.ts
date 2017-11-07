export abstract class AbstractUser {

  // personal info
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  birthPlace: string;
  updatedAt: Date;
  createdAt: Date;
  // profile picture
  location: string;

  constructor(json?) {
    if (!json)
      return;
    this.id = json.id;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    if (json.dateOfBirth)
      this.dateOfBirth = new Date(json.dateOfBirth);
    this.birthPlace = json.birthPlace;
    this.location = json.location;
    if (json.updatedAt)
      this.updatedAt = new Date(json.updatedAt);
    if (json.createdAt)
      this.createdAt = new Date(json.createdAt);
  }
}
