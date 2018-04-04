import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {Platform} from 'ionic-angular/platform/platform';

@Directive({selector: '[prismaIfPlatform]'})
export class IfPlatformDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private platform: Platform
  ) {}

  @Input()
  set prismaIfPlatform(id: string) {
    if (id) {
      if (this.platformIs(id) && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!this.platformIs(id) && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    }
  }

  private platformIs(id: string): boolean {
    /* Legal id's:
      cordova
      notCordova
    */
    switch (id.trim()) {
      case 'cordova': {
        return this.platform.is('cordova');
      }
      case 'notCordova': {
        return !this.platform.is('cordova');
      }
      default: {
        return this.platform.is(id);
      }
    }
  }
}
