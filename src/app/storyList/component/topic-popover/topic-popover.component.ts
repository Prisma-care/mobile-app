import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular/navigation/nav-params';

/**
 * Generated class for the TopicPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'prisma-topic-popover',
  templateUrl: 'topic-popover.component.html'
})
export class TopicPopoverComponent {
  topicQuery: '';

  constructor(private params: NavParams) {
    this.topicQuery = this.params.get('topicQuery');
  }
}
