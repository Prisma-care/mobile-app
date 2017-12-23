import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {AppComponent} from './app.component';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Camera} from '@ionic-native/camera';
import {File} from '@ionic-native/file';
import {Transfer} from '@ionic-native/transfer';
import {FilePath} from '@ionic-native/file-path';
import {Network} from '@ionic-native/network';

import {NativePageTransitions} from '@ionic-native/native-page-transitions';

import {CoreModule} from './core/core.module';
import {AuthModule} from './auth/auth.module';
import {ConstantProvider} from './di';
import {AlbumModule} from './albumList/album.module';
import {StoryModule} from './storyList/story.module';
import {SidebarModule} from './sidebar/sidebar.module';
import {LoaderModule} from './loader/loader.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {statusbarPadding: false}),
    IonicStorageModule.forRoot(),
    CoreModule,
    AuthModule,
    SidebarModule,
    LoaderModule,
    AlbumModule,
    StoryModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [AppComponent],
  providers: [
    ConstantProvider,
    StatusBar,
    SplashScreen,
    Camera,
    File,
    Transfer,
    FilePath,
    NativePageTransitions,
    Network,
    YoutubeVideoPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
