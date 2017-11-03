import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {SidebarComponent} from "./sidebar.component";
import {InvitePage} from "./invite/invite";
import {GiveFeedbackComponent} from "./giveFeedback/giveFeedback.component";

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  SidebarComponent,
  InvitePage,
  GiveFeedbackComponent
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  entryComponents: [GiveFeedbackComponent, InvitePage],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class SidebarModule {
}
