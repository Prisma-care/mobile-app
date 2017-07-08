import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
@Injectable()
export class StanizerService {

  constructor(private sanitizer: DomSanitizer) {
  }

  public sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
