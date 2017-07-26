import {Injectable} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
@Injectable()
export class StanizerService {

  constructor(private sanitizer: DomSanitizer) {
  }

  public sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  public sanitizeVideo(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public sanitizeStyle(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(url);
  }
}
