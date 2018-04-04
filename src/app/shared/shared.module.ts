import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';
import {AlbumOrStoryComponent} from './component/albumOrStory.component';
import {ToggleFullscreenDirective} from './directive/toggleFullscreen.directive';
import {IfFullscreenDirective} from './directive/ifFullscreen.directive';
import {IfPlatformDirective} from './directive/ifPlatform.directive';
import {FullscreenButtonComponent} from './component/fullscreenButton.component';

const imports = [ReactiveFormsModule, FormsModule, IonicModule];
const declarations = [
  AlbumOrStoryComponent,
  ToggleFullscreenDirective,
  IfFullscreenDirective,
  FullscreenButtonComponent,
  IfPlatformDirective
];

@NgModule({
  declarations,
  imports,
  providers: [],
  exports: [...imports, ...declarations]
})
export class SharedModule {}
