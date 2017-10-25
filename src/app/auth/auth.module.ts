import {NgModule} from '@angular/core';
import {AuthenticationHeaderComponent} from './components/authentication-header.component';
import {AuthenticationRegisterComponent} from './components/authentication-register.component';
import {AuthenticationLoginComponent} from './components/authentication-login.component';
import {SharedModule} from '../shared/shared.module';
import {AuthenticationPage} from './authentication.component';

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  AuthenticationHeaderComponent,
  AuthenticationRegisterComponent,
  AuthenticationLoginComponent,
  AuthenticationPage
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  entryComponents: [AuthenticationPage],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class AuthModule {
}
