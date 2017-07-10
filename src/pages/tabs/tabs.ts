import { Component } from '@angular/core';

import { StoriesPage } from '../stories/stories';
import { BrowsePage } from '../browse/browse';
import { AddStoryPage } from '../addstory/addstory';
import { PatientProfilePage } from '../patientprofile/patientprofile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StoriesPage;
  tab2Root = BrowsePage;
  tab3Root = AddStoryPage;
  tab4Root = PatientProfilePage;
  
  constructor() {

  }
}
