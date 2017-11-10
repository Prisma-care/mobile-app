import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";
import {MyApp} from "./app.component";
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player';


import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StanizerService} from "../providers/stanizer.service";
import {Camera} from "@ionic-native/camera";
import {UtilService} from "../providers/util-service";
import {File} from "@ionic-native/file";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {Network} from "@ionic-native/network";

import {QuestionService} from "../providers/question-service/question.service";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";

import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';
import {MixpanelService} from '../providers/analytics/mixpanel.service';
import {FullstoryService} from '../providers/analytics/fullstory.service';
import {CoreModule} from './core/core.module';
import {AuthModule} from './auth/auth.module';
import {EnvironmentProvider} from './environment';
import {AlbumModule} from "./albumList/album.module";
import {StoryModule} from "./storyList/story.module";
import {SidebarModule} from "./sidebar/sidebar.module";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {statusbarPadding: false}),
    IonicStorageModule.forRoot(),
    CoreModule,
    AuthModule,
    SidebarModule,
    AlbumModule,
    StoryModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    EnvironmentProvider,
    StatusBar,
    SplashScreen,
    UtilService,
    StanizerService,
    QuestionService,
    Camera,
    File,
    Transfer,
    FilePath,
    NativePageTransitions,
    Network,
    YoutubeVideoPlayer,
    Mixpanel,
    MixpanelPeople,
    MixpanelService,
    FullstoryService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {
}
