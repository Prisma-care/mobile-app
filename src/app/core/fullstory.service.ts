import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {User} from '../../dto/user';

/*
  Generated class for the FullstoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FullstoryService {
  identify(user: User) {
    // This is an example script - don't forget to change it!

    if ('FS' in window) {
      window['FS'].identify(String(user.id), {
        displayName: `${user.firstName} ${user.lastName}`,
        email: user.email
      });
    } else {
      console.log(`FullStory's global variable is not accessible.`);
    }
  }
}
