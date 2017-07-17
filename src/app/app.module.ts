import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import { IonicStorageModule } from '@ionic/storage';
import {MyApp} from "./app.component";

import {StoriesPage} from "../pages/stories/stories";
import {BrowsePage} from "../pages/browse/browse";
import {PatientProfilePage} from "../pages/patientprofile/patientprofile";
import {TabsPage} from "../pages/tabs/tabs";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../services/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../services/back-end/prisma-api.service";
import {UserService} from "../services/back-end/user.service";
import {HttpModule} from "@angular/http";
import {StoryService} from "../services/back-end/story.service";
import {TutorialPage} from "../pages/tutorial/tutorial";
import { Camera } from '@ionic-native/camera';
import {NewStoryPage} from "../pages/new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../services/util-service";
import { QuestionsPage } from "../pages/questions/questions";


@NgModule({
  declarations: [
    MyApp,
    TutorialPage,
    StoriesPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    QuestionsPage,
    NewStoryPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TutorialPage,
    StoriesPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    NewStoryPage,
    QuestionsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UtilService,
    StanizerService,
    PrismaService,
    StoryService,
    UserService,
    Camera,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
