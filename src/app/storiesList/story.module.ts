import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {StoryListPage} from "./storyList.component";
import {StoryComponent} from "./story/story.component";
import {QuestionComponent} from "./question/question.component";

const IMPORTS = [
  SharedModule
];
const DECLARATIONS = [
  StoryListPage,
  StoryComponent,
  QuestionComponent
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
