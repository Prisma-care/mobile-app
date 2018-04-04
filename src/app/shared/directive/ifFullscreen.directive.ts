import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import * as screenfull from 'screenfull';

@Directive({selector: '[prismaIfFullscreen]'})
export class IfFullscreenDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set prismaIfFullscreen(condition: boolean) {
    if (this.fullscreenIs(condition) && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!this.fullscreenIs(condition) && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private fullscreenIs(condition: boolean): boolean {
    return screenfull.isFullscreen === condition;
  }
}
