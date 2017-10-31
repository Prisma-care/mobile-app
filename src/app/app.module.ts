import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";
import {MyApp} from "./app.component";
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player';


import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../providers/stanizer.service";
import {StoryDetailsPage} from "../pages/storydetails/storydetails";
import {PrismaService} from "../providers/back-end/prisma-api.service";
import {PatientService} from "../providers/back-end/user.service";
import {Http} from "@angular/http";
import {StoryService} from "../providers/back-end/story.service";
import {Camera} from "@ionic-native/camera";
import {NewStoryPage} from "../pages/new-story/new-story";
import {UtilService} from "../providers/util-service";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Network} from "@ionic-native/network";

import {AlbumsPage} from "../pages/albums/albums";
import {AlbumDetailPage} from "../pages/album-detail/album-detail";
import {AuthService} from "../providers/auth-service/auth-service";
import {QuestionService} from "../providers/question-service/question.service";
import {AlbumQuestions} from "../pages/album-detail/album-questions";
import {AuthGuard} from "../pages/auth-guard";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {StoryOptionsComponent} from "../pages/storydetails/story-options.component";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslatorService} from "../providers/translator.service";
import {LoginHeaderComponent} from "../pages/login/login-header.component";
import {InvitePage} from "../pages/invite/invite";

import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';
import {Analytics} from '../providers/analytics';
import {CoreModule} from './core/core.module';
import {AuthModule} from './auth/auth.module';
import {EnvironmentProvider} from './environment';
import {SidebarComponent} from "./components/sidebar.component";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    AlbumsPage,
    AlbumDetailPage,
    StoryDetailsPage,
    NewStoryPage,
    AlbumQuestions,
    StoryOptionsComponent,
    LoginHeaderComponent,
    InvitePage,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CoreModule,
    AuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlbumsPage,
    AlbumDetailPage,
    StoryDetailsPage,
    NewStoryPage,
    AlbumQuestions,
    StoryOptionsComponent,
    InvitePage,
    SidebarComponent
  ],
  providers: [
    EnvironmentProvider,
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
    Transfer,
    FilePath,
    NativePageTransitions,
    TranslatorService,
    Network,
    YoutubeVideoPlayer,
    Mixpanel,
    MixpanelPeople,
    Analytics,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
