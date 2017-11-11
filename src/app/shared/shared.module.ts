import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';
import { AlbumOrStoryComponent } from './component/albumOrStory.component';

const IMPORTS = [
  ReactiveFormsModule,
  FormsModule,
  IonicModule,
];
const DECLARATIONS = [
  AlbumOrStoryComponent,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class SharedModule {
}
