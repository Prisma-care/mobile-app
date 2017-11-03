import { NgModule } from '@angular/core';
import { AuthenticationHeaderComponent } from './components/authentication-header.component';
import { AuthenticationRegisterComponent } from './components/authentication-register.component';
import { AuthenticationLoginComponent } from './components/authentication-login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationPage } from './authentication.component';
import { NewLovedonePage } from "./components/new-lovedone/new-lovedone";
import { PasswordResetComponent } from "./components/password-reset/password-reset.component";
import { IntroPage } from './components/intro/intro.component';

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  AuthenticationHeaderComponent,
  AuthenticationRegisterComponent,
  AuthenticationLoginComponent,
  AuthenticationPage,
  NewLovedonePage,
  PasswordResetComponent,
  IntroPage
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  entryComponents: [IntroPage, AuthenticationPage, NewLovedonePage, PasswordResetComponent],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class AuthModule {
}
