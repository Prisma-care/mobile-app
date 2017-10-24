import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';

const IMPORTS = [
  HttpClientModule,
  HttpModule
];
const DECLARATIONS = [
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  exports: [
    ...IMPORTS
  ]
})
export class CoreModule {
}
