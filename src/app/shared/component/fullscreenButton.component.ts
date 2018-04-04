import {Component} from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
  template: `
        <button class="prisma-fs-button" (click)="toggleFullscreen()">
            <img *ngIf="!isFullscreen()" src="assets/icon/fs-icon.svg"/>
            <img *ngIf="isFullscreen()" src="assets/icon/fs-icon-back.svg"/>
        </button>
    `,
  styles: [
    `
        .prisma-fs-button {
            background: none;
            width: 3.5rem;
        }
    `
  ],
  selector: 'prisma-fullscreen-button'
})
export class FullcreenButtonComponent {
  isFullscreen(): boolean {
    return screenfull.isFullscreen;
  }

  toggleFullscreen(): void {
    screenfull.toggle();
  }
}
