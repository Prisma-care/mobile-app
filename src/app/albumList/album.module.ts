import {NgModule} from '@angular/core';
import {AlbumListComponent} from './albumList.component';
import {SharedModule} from '../shared/shared.module';

const imports = [SharedModule];
const declarations = [AlbumListComponent];

@NgModule({
  declarations,
  imports,
  providers: [],
  entryComponents: [AlbumListComponent],
  exports: [...imports, ...declarations]
})
export class AlbumModule {}
