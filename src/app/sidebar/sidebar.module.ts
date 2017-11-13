import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {SidebarComponent} from './sidebar.component';
import {InviteComponent} from './component/invite/invite';
import {GiveFeedbackComponent} from './component/giveFeedback/giveFeedback.component';

const imports = [SharedModule];
const declarations = [SidebarComponent, InviteComponent, GiveFeedbackComponent];

@NgModule({
  declarations,
  imports,
  providers: [],
  entryComponents: [GiveFeedbackComponent, InviteComponent],
  exports: [...imports, ...declarations]
})
export class SidebarModule {}
