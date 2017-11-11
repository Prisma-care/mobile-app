import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationInterceptor} from './interceptors/authentication.interceptor';
import {CommonHeadersInterceptor} from './interceptors/common-headers.interceptor';
import {UnauthorizedErrorInterceptor} from './interceptors/unauthorized-error.interceptor';
import {AuthenticationService} from './authentication.service';
import {IonicModule} from 'ionic-angular';
import {PatientService} from './patient.service';
import {UserService} from './user.service';
import {AlbumService} from './album.service';
import {StoryService} from './story.service';
import {QuestionService} from './question.service';
import {InvalidTokenInterceptor} from './interceptors/invalid-token.interceptor';
import {NetworkInterceptor} from './interceptors/network.interceptor';
import {MixpanelService} from './mixpanel.service';
import {FullstoryService} from './fullstory.service';
import {Mixpanel, MixpanelPeople} from '@ionic-native/mixpanel';

const imports = [HttpClientModule, HttpModule, IonicModule];

@NgModule({
  declarations: [],
  imports,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonHeadersInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InvalidTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    },
    AuthenticationService,
    PatientService,
    UserService,
    AlbumService,
    StoryService,
    QuestionService,
    MixpanelService,
    FullstoryService,
    Mixpanel,
    MixpanelPeople
  ],
  exports: [...imports]
})
export class CoreModule {}
