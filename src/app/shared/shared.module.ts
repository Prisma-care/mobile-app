import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';

const IMPORTS = [
  ReactiveFormsModule,
  FormsModule,
  IonicModule
];
const DECLARATIONS = [];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  exports: [
    ...IMPORTS
  ]
})
export class SharedModule {
}
