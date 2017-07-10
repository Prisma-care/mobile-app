import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";

import {StoriesPage} from "../pages/stories/stories";
import {AddStoryPage} from "../pages/addstory/addstory";
import {TabsPage} from "../pages/tabs/tabs";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../services/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../services/back-end/prisma-api.service";

@NgModule({
  declarations: [
    MyApp,
    StoriesPage,
    AddStoryPage,
    StoryDetailsPage,
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
    StoryDetailsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StanizerService,
    PrismaService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
