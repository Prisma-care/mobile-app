import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';

import {environment} from '../environments/environment';
import {AppModule} from './app.module';

if (environment.currentEnv === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
