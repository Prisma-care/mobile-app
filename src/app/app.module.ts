import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";
import {MyApp} from "./app.component";


import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../providers/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../providers/back-end/prisma-api.service";
import {PatientService} from "../providers/back-end/user.service";
import {HttpModule, Http} from "@angular/http";
import {StoryService} from "../providers/back-end/story.service";
import {Camera} from "@ionic-native/camera";
import {NewStoryPage} from "../pages/new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../providers/util-service";


import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";

import {AlbumsPage} from "../pages/albums/albums";
import {AlbumDetailPage} from "../pages/album-detail/album-detail";
import {AuthService} from "../providers/auth-service/auth-service";
import {QuestionService} from "../providers/question-service/question.service";
import {AlbumQuestions} from "../pages/album-detail/album-questions";
import {LoginPage} from "../pages/login/login";
import {AuthGuard} from "../pages/auth-guard";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {StoryOptionsComponent} from "../pages/storydetails/story-options.component";
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {TranslatorService} from "../providers/translator.service";
import { LoginHeaderComponent } from "../pages/login/login-header.component";
import { NewLovedonePage } from "../pages/new-lovedone/new-lovedone";
import {InvitePage} from "../pages/invite/invite";


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AlbumsPage,
    AlbumDetailPage,
    StoryDetailsPage,
    NewStoryPage,
    AlbumQuestions,
    StoryOptionsComponent,
    LoginHeaderComponent,
    InvitePage,
    NewLovedonePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AlbumsPage,
    AlbumDetailPage,
    StoryDetailsPage,
    NewStoryPage,
    AlbumQuestions,
    StoryOptionsComponent,
    NewLovedonePage,
    InvitePage
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
    AuthGuard,
    AuthService,
    Camera,
    File,
    FileTransfer,
    FileChooser,
    Transfer,
    FilePath,
    NativePageTransitions,
    TranslatorService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
