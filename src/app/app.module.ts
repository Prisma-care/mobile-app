import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StoriesPage } from '../pages/stories/stories';
import { AddStoryPage } from '../pages/addstory/addstory';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StanizerService } from '../services/stanizer.service';

@NgModule({
  declarations: [
    MyApp,
    StoriesPage,
    AddStoryPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StoriesPage,
    AddStoryPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StanizerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
