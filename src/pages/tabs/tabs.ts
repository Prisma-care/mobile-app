import { Component } from '@angular/core';

import { StoriesPage } from '../stories/stories';
import { AddStoryPage } from '../addstory/addstory';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = AddStoryPage;
  
  constructor() {

  }
}
