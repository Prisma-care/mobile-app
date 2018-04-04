import {Directive, HostListener} from '@angular/core';
import * as screenfull from 'screenfull';

@Directive({
  selector: '[prismaToggleFullscreen]'
})
export class ToggleFullscreenDirective {
  @HostListener('click')
  onClick() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
