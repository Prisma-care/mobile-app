import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule } from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";
import {MyApp} from "./app.component";

import {StoriesPage} from "../pages/stories/stories";
import {BrowsePage} from "../pages/browse/browse";
import {PatientProfilePage} from "../pages/patientprofile/patientprofile";

import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../providers/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../providers/back-end/prisma-api.service";
import {PatientService} from "../providers/back-end/user.service";
import {HttpModule} from "@angular/http";
import {StoryService} from "../providers/back-end/story.service";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {Camera} from "@ionic-native/camera";
import {NewStoryPage} from "../pages/new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../providers/util-service";

import {EmptyPage} from "../pages/empty/empty";
import {ApiTestingPage} from "../pages/api-testing/api-testing";

import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Dialogs} from "@ionic-native/dialogs"

import {AlbumsPage} from "../pages/albums/albums";
import {AlbumDetailPage} from "../pages/album-detail/album-detail";
import { AuthService } from '../providers/auth-service/auth-service';
import { QuestionService } from "../providers/question-service/question.service";
import { AlbumQuestions } from "../pages/album-detail/album-questions";


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
    NewStoryPage,
    EmptyPage,
    ApiTestingPage,
    AlbumQuestions
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
    EmptyPage,
    ApiTestingPage,
    AlbumQuestions
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UtilService,
    StanizerService,
    QuestionService,
    PrismaService,
    StoryService,
    PatientService,
    Camera,
    File,
    FileTransfer,
    FileChooser,
    Transfer,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Dialogs
  ]
})
export class AppModule {
}
