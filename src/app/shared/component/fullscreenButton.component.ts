import {Component} from '@angular/core';
import * as screenfull from 'screenfull';
import {IfFullscreenDirective} from '../directive/ifFullscreen.directive';
import {ToggleFullscreenDirective} from '../directive/toggleFullscreen.directive';
import {IfPlatformDirective} from '../directive/ifPlatform.directive';

@Component({
  template: `
        <button class="prisma-fs-button" *prismaIfPlatform='"notCordova"' prismaToggleFullscreen>
            <img *prismaIfFullscreen="false" src="assets/icon/fs-icon.svg"/>
            <img *prismaIfFullscreen="true" src="assets/icon/fs-icon-back.svg"/>
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
export class FullscreenButtonComponent {}
