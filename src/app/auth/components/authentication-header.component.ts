import {Component, Input} from '@angular/core';

@Component({
  selector: 'prisma-authentication-header',
  template: `
  <ion-navbar>
    <ion-title>
      {{title}}
    </ion-title>
  </ion-navbar>
  `
})
export class AuthenticationHeaderComponent {
  @Input()
  title
}
