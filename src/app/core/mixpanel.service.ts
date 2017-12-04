import {Injectable, Inject} from '@angular/core';
import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';
import {User, Constant} from '../../shared/types';
import {ConstantToken} from '../di';

declare var cordova: any;

@Injectable()
export class MixpanelService {
  isInit = false;
  private token = '0c69ebeb92fc86a0b9d813b5fb6215e7';

  constructor(
    private mixpanel: Mixpanel,
    private mixpanelPeople: MixpanelPeople,
    @Inject(ConstantToken) private constant: Constant
  ) {
    this.init();
  }

  init() {
    return this.initMixpanel().then(success => {
      this.isInit = true;
    });
  }

  initMixpanel(): Promise<any> {
    return this.mixpanel.init(this.token).catch(err => {
      console.error('Error mixpanel.init', err);
      this.isInit = false;
    });
  }

  track(eventName, props?: any): void {
    if (this.constant.tracking) {
      if (this.isInit) {
        this.mixpanel.track(eventName, props);
        return;
      }

      this.init().then(() => {
        this.mixpanel.track(eventName, props);
      });
    } else {
      console.warn(
        'Mixpanel tracking disabled in environment.ts. Use "gulp production" to enable.'
      );
    }
  }

  identify(user: User): void {
    // a function that handles the mixpanel registration
    const mixpanelIdentify: (() => void) = () => {
      if (
        !this.constant.trackingExcluded.find(
          excludedMail => excludedMail === user.email
        )
      ) {
        this.mixpanel
          .identify(String(user.id))
          .then(() => {
            this.mixpanelPeople
              .set({
                $first_name: user.firstName,
                $last_name: user.lastName,
                $created: null,
                $email: user.email
              })
              .catch(err => {
                console.error(
                  'Error at binding user info to mixpanel identification.',
                  err
                );
              });
          })
          .catch(err =>
            console.error('Mixpanel user identification error', err)
          );
      } else {
        this.mixpanel.registerSuperProperties({$ignore: true});
        console.warn(
          `Mixpanel logging disabled for "${user.email}" in environment.ts.`
        );
      }
    };

    if (this.isInit) {
      mixpanelIdentify();
    } else {
      this.init().then(mixpanelIdentify);
    }
  }
}
