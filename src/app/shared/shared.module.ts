import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';
import {AlbumOrStoryComponent} from './component/albumOrStory.component';
import {ToggleFullscreenDirective} from './directive/fullscreen.directive';
import {FullcreenButtonComponent} from './component/fullscreenButton.component';

const imports = [ReactiveFormsModule, FormsModule, IonicModule];
const declarations = [
  AlbumOrStoryComponent,
  ToggleFullscreenDirective,
  FullcreenButtonComponent
];

@NgModule({
  declarations,
  imports,
  providers: [],
  exports: [...imports, ...declarations]
})
export class SharedModule {}
