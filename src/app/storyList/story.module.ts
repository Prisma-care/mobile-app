import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {StoryListPage} from "./storyList.component";
import {StoryComponent} from "./story/story.component";
import {QuestionComponent} from "./question/question.component";
import {StoryDetailsPage} from "./story/storyDetail/storyDetail.component";

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  StoryListPage,
  StoryComponent
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...IMPORTS],
  providers: [],
  entryComponents: [StoryListPage],
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class StoryModule {
}
