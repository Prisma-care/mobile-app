import {NgModule} from '@angular/core';
import {AlbumPage} from "./album/album.component";
import {AlbumListPage} from "./albumList.component";
import {SharedModule} from "../shared/shared.module";

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  AlbumPage,
  AlbumListPage
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  entryComponents: [AlbumListPage],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class AlbumModule {
}
