import {NgModule} from '@angular/core';
import {AuthenticationHeaderComponent} from './components/authentication-header.component';
import {AuthenticationRegisterComponent} from './components/authentication-register.component';
import {AuthenticationLoginComponent} from './components/authentication-login.component';
import {SharedModule} from '../shared/shared.module';
import {AuthenticationComponent} from './authentication.component';
import {NewLovedoneComponent} from './components/new-lovedone/new-lovedone';
import {PasswordResetComponent} from './components/password-reset/password-reset.component';
import {IntroComponent} from './components/intro/intro.component';

const imports = [SharedModule];
const declarations = [
  AuthenticationHeaderComponent,
  AuthenticationRegisterComponent,
  AuthenticationLoginComponent,
  AuthenticationComponent,
  NewLovedoneComponent,
  PasswordResetComponent,
  IntroComponent
];

@NgModule({
  declarations,
  imports,
  providers: [],
  entryComponents: [
    IntroComponent,
    AuthenticationComponent,
    NewLovedoneComponent,
    PasswordResetComponent
  ],
  exports: [...imports, ...declarations]
})
export class AuthModule {}
