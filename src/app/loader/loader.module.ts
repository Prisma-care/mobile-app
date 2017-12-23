import {PopoverController} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {LoaderComponent} from './component/prisma-loader';
import {NetworkInterceptor} from '../core/interceptors/network.interceptor';
import {LoaderService} from '../core/loader.service';

@NgModule({
  declarations: [LoaderComponent],
  imports: [],
  exports: [LoaderComponent],
  entryComponents: [LoaderComponent],
  providers: [PopoverController, LoaderService]
})
export class LoaderModule {}
