import {NgModule} from '@angular/core';
import {AlbumListPage} from "./albumList.component";
import {SharedModule} from "../shared/shared.module";

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
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
