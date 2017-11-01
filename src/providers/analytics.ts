import {Injectable} from "@angular/core";
import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';
import { User } from "../dto/user";


declare var cordova: any;

@Injectable()
export class Analytics {
  isInit = false;
  private token = '0c69ebeb92fc86a0b9d813b5fb6215e7';

  constructor(private mixpanel: Mixpanel, private mixpanelPeople: MixpanelPeople) {
    this.init();
  }

  init() {
    return this.initMixpanel()
      .then((success) => {
        this.isInit = true;
      })

  }

  initMixpanel(): Promise<any> {
    return this.mixpanel.init(this.token)
      .catch((err) => {
        console.log('Error mixpanel.init', err);
        this.isInit = false;
      });
  }

  track(eventName, props?: any) {
    if (this.isInit) {
      this.mixpanel.track(eventName, props);
      return;
    }

    this.init().then(() => {
      this.mixpanel.track(eventName, props);
    });
  }

  identify(user: User): void {
    this.mixpanelIdentify(user);
    this.fullStoryIdentify(user);
  }

  mixpanelIdentify(user: User): void {
    // a function that handles the mixpanel registration
    let mixpanelIdentify: (() => void) =
      () => this.mixpanel.identify(String(user.id))
        .then(() => {
            const mixProps: any = {
              "$first_name": user.firstName,
              "$last_name": user.lastName,
              "$created": user.createdAt,
              "$email": user.email
            };
            console.log("user = " + JSON.stringify(user));
            // setOnce will not overwrite an already existing profile
            this.mixpanelPeople.setOnce(mixProps).catch((err) => {
              console.log('Error at binding user info to mixpanel identification.', err)
            });

          }
        )
        .catch((err) => console.log("Mixpanel user identification error", err));

    if (this.isInit) {
      mixpanelIdentify();
    }
    else {
      this.init().then(mixpanelIdentify);
    }
  }

  /**
    This exports the FS object from FullStory's tracking snippet
  */
  getFullStory(): any {
    window['_fs_debug'] = false;
    window['_fs_host'] = 'fullstory.com';
    window['_fs_org'] = '8BAS6';
    window['_fs_namespace'] = 'FS';

    return (function(m, n, e, t, l, o, g, y) {
            if (e in m) {
                // >>>> CHANGED - return the existing fs if aldready existing
                if (m[e].identify) {
                  return m[e];
                }
                else {
                  if (m.console && m.console.log) {
                      m.console.log('FullStory was already loaded, but contains no identify function.');
                  }
                  return;
                }

                /*
                if (m.console && m.console.log) {
                    m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
                }
                return;
                */
            }
            g = m[e] = function(a, b) {					// export a bootstrap function to g and the namespace
                g.q ? g.q.push([a, b]) : g._api(a, b);
            };
            g.q = [];

            o = n.createElement(t); // create a new script element in window
            o.async = 1;
            o.src = 'https://' + window["_fs_host"] + '/s/fs.js';

            y = n.getElementsByTagName(t)[0];
            y.parentNode.insertBefore(o, y);

            g.identify = function(i, v) { // create the identify function
                g(l, {
                    uid: i
                });
                if (v) g(l, v)
            };

            g.setUserVars = function(v) { // create the setUserVars function
                g(l, v)
            };

            g.identifyAccount = function(i, v) { // create the identifyAccount function
                o = 'account';
                v = v || {};
                v.acctId = i;
                g(o, v)
            };

            g.clearUserCookie = function(c, d, i) { // create the clearUserCookie function
                if (!c || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')) {
                    d = n.domain;
                    while (1) {
                        n.cookie = 'fs_uid=;domain=' + d +
                            ';path=/;expires=' + new Date(0).toUTCString();
                        i = d.indexOf('.');
                        if (i < 0) break;
                        d = d.slice(i + 1)
                    }
                }
            };

            // ADDED - return the FS object
            return g;

        })(window, document, window['_fs_namespace'], 'script', 'user');
  }

  fullStoryIdentify(user: User) {
    // This is an example script - don't forget to change it!
    this.getFullStory().identify(String(user.id), {
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email
    });
  }
}
