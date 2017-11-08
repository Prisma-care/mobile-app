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
import {Http} from "@angular/http";
import {Camera} from "@ionic-native/camera";
import {NewStoryPage} from "../pages/new-story/new-story";
import {UtilService} from "../providers/util-service";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Network} from "@ionic-native/network";

import {AlbumsPage} from "../pages/albums/albums";
import {AlbumDetailPage} from "../pages/album-detail/album-detail";
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
import {AlbumModule} from "./albumList/album.module";
import {StoryModule} from "./storyList/story.module";
import {SidebarModule} from "./sidebar/sidebar.module";
import { LoginPage } from "../pages/login/login";
import { NewLovedonePage } from "../pages/new-lovedone/new-lovedone";

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
    LoginPage,
    NewLovedonePage,
    InvitePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {statusbarPadding: false}),
    IonicStorageModule.forRoot(),
    CoreModule,
    AuthModule,
    SidebarModule,
    AlbumModule,
    StoryModule,
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
  ],
  providers: [
    EnvironmentProvider,
    StatusBar,
    SplashScreen,
    UtilService,
    StanizerService,
    QuestionService,
    AuthGuard,
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
