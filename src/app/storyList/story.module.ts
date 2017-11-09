import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {StoryListPage} from "./storyList.component";
import {QuestionComponent} from "./question/question.component";
import {StoryDetailsPage} from "./story/storyDetail/storyDetail.component";
import {StoryOptionsComponent} from "./story/storyDetail/component/storyOptions.component";
import { StoryListOptionsComponent } from './component/storyListOptions.component';
import { CreateOrUpdateStoryPage } from './createOrUpdateStory/createOrUpdateStory.component';

const imports = [
  SharedModule
];
const declarations = [
  StoryListPage,
  StoryDetailsPage,
  StoryOptionsComponent,
  QuestionComponent,
  StoryListOptionsComponent,
  CreateOrUpdateStoryPage,
];

@NgModule({
  declarations,
  imports,
  providers: [],
  entryComponents: [StoryListPage, StoryDetailsPage, StoryOptionsComponent, StoryListOptionsComponent, CreateOrUpdateStoryPage],
  exports: [
    ...imports,
    ...declarations
  ]
})
export class StoryModule {
}
