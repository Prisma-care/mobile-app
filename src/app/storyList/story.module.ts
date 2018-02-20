import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {StoryListComponent} from './storyList.component';
import {QuestionComponent} from './component/question/question.component';
import {StoryDetailsComponent} from './component/storyDetail/storyDetail.component';
import {StoryOptionsComponent} from './component/storyDetail/component/storyOptions.component';
import {StoryListOptionsComponent} from './component/storyListOptions.component';
import {CreateOrUpdateStoryComponent} from './component/createOrUpdateStory/createOrUpdateStory.component';
import {TopicPopoverComponent} from './component/topic-popover/topic-popover.component';

const imports = [SharedModule];
const declarations = [
  StoryListComponent,
  StoryDetailsComponent,
  StoryOptionsComponent,
  QuestionComponent,
  StoryListOptionsComponent,
  CreateOrUpdateStoryComponent,
  TopicPopoverComponent
];

@NgModule({
  declarations,
  imports,
  providers: [],
  entryComponents: [
    StoryListComponent,
    StoryDetailsComponent,
    StoryOptionsComponent,
    StoryListOptionsComponent,
    CreateOrUpdateStoryComponent,
    TopicPopoverComponent
  ],
  exports: [...imports, ...declarations]
})
export class StoryModule {}
