import {NgModule} from '@angular/core';

const IMPORTS = [];
const DECLARATIONS = [];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  exports: [
    ...IMPORTS
  ]
})
export class AuthModule {
}
