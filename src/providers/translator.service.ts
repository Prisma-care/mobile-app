import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {env} from "../app/environment";

@Injectable()
export class TranslatorService {
  public lang: string = 'nl';

  public constructor(public translateIn: TranslateService) {
    translateIn.addLangs(['en', 'fr', 'nl']);
    translateIn.setDefaultLang(this.lang);

    let browserLang: string = /** this.translateIn.getBrowserLang() || */this.lang;
    if (!localStorage.getItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG))
      if (browserLang.toLowerCase().indexOf('en') >= 0 || browserLang.toLowerCase().indexOf('fr') >= 0 || browserLang.toLowerCase().indexOf('nl') >= 0) {
        translateIn.use(this.translateIn.getBrowserLang());
        this.switchLang(this.translateIn.getBrowserLang().toLowerCase());
      }

    this.refresh();
  }

  /*
   Allows the translator to refresh the local language
   */
  public refresh() {
    if (localStorage.getItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG)) {
      this.lang = '' + localStorage.getItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG);
      this.refreshTranslation();
      return;
    }
    this.refreshTranslation();
  }

  private refreshTranslation() {
    this.translateIn.use(this.lang);
  }

  public switchLang(lang?: string): void {
    this.lang = lang;
    localStorage.setItem(env.localstorage.LOCALSTORAGE_SELECTEDLANG, lang || this.lang);
    this.refreshTranslation();
  }

  /**
   * Return the available language to select
   */
  public notSelectedLang(lang?: string): string {
    if (lang) {
      if (lang == 'fr' || lang == 'en')
        return lang;
    }

    if (this.lang == 'fr')
      return 'en';
    else
      return 'fr';
  }

  /**
    Translates the given string (key). Translations are guarantueed to be loaded.
    The callback will be called with the resulting translation (1 argument).
  */
  public translate(key: string, callback: (arg: string) => string ) : void {
    this.translateIn.get(key).subscribe((val) => callback(val));
  }

/**
  Translates the given string intantaneously.
  The translation might not be loaded yet.
*/
  public translateInstant(key: string): string {
    return this.translateIn.instant(key);
  }

}
