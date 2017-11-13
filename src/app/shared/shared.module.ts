import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from 'ionic-angular';
import {AlbumOrStoryComponent} from './component/albumOrStory.component';

const imports = [ReactiveFormsModule, FormsModule, IonicModule];
const declarations = [AlbumOrStoryComponent];

@NgModule({
  declarations,
  imports,
  providers: [],
  exports: [...imports, ...declarations]
})
export class SharedModule {}
