import {Component} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";

import {StoriesPage} from "../stories/stories";
import {BrowsePage} from "../browse/browse";
import {PatientProfilePage} from "../patientprofile/patientprofile";
import { QuestionsPage } from "../questions/questions";

import { Camera } from '@ionic-native/camera';
import {NewStoryPage} from "../new-story/new-story";
import {FileChooser} from "@ionic-native/file-chooser";
import {UtilService} from "../../services/util-service";
import {NewStorySelectionPage} from "../new-story-selection/new-story-selection";
import { AlbumsPage } from "../albums/albums";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AlbumsPage;
  tab2Root = NewStorySelectionPage;
  tab3Root = QuestionsPage;

  tab4Root = PatientProfilePage;
  constructor(public actionsheetCtrl: ActionSheetController,private utilService:UtilService,public navCtrl: NavController) {
  }

}
