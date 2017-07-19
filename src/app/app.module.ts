import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import { IonicStorageModule } from '@ionic/storage';
import {MyApp} from "./app.component";

import {StoriesPage} from "../pages/stories/stories";
import {BrowsePage} from "../pages/browse/browse";
import {PatientProfilePage} from "../pages/patientprofile/patientprofile";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../services/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../services/back-end/prisma-api.service";
import {PatientService} from "../services/back-end/user.service";
import {HttpModule} from "@angular/http";
import {StoryService} from "../services/back-end/story.service";
import {TutorialPage} from "../pages/tutorial/tutorial";
import { Camera } from '@ionic-native/camera';
import {NewStoryPage} from "../pages/new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../services/util-service";

import { QuestionsPage } from "../pages/questions/questions";
import { QuestionPage } from "../pages/question/question";
import {NewStorySelectionPage} from "../pages/new-story-selection/new-story-selection";
import {EmptyPage} from "../pages/empty/empty";
import {ApiTestingPage} from "../pages/api-testing/api-testing";
import { AlbumsPage } from "../pages/albums/albums";
import { AlbumDetailPage } from "../pages/album-detail/album-detail";


@NgModule({
  declarations: [
    MyApp,
    TutorialPage,
    StoriesPage,
    AlbumsPage,
    AlbumDetailPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    QuestionsPage,
    QuestionPage,
    NewStoryPage,
    EmptyPage,
    NewStorySelectionPage,
    ApiTestingPage,
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
    AlbumsPage,
    AlbumDetailPage,
    BrowsePage,
    PatientProfilePage,
    StoryDetailsPage,
    NewStoryPage,
    QuestionsPage,
    QuestionPage,
    EmptyPage,
    NewStorySelectionPage,
    ApiTestingPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UtilService,
    StanizerService,
    PrismaService,
    StoryService,
    PatientService,
    Camera,
    FileChooser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
