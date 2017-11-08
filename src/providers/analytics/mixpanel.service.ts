import {Injectable} from "@angular/core";
import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';
import { User } from "../../dto/user";


declare var cordova: any;

@Injectable()
export class MixpanelService {
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
}
