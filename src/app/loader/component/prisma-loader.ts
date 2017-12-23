import {Component} from '@angular/core';
import {PopoverController} from 'ionic-angular/components/popover/popover-controller';
import {OnInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {NetworkInterceptor} from '../../core/interceptors/network.interceptor';
import {LoaderService} from '../../core/loader.service';

/**
 * Generated class for the PrismaLoaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'prisma-loader',
  templateUrl: 'prisma-loader.html'
})
export class LoaderComponent implements OnInit {
  value = true;

  constructor(
    private popover: PopoverController,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.connection.subscribe(value => (this.value = value));
  }
}
