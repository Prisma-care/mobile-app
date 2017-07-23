import { QuestionService } from "../../providers/question-service/question.service";
import { OnInit, Component, Input } from "@angular/core";

@Component({
  selector: 'album-questions',
  template: `
      <div class="page-header" *ngIf="currentQuestion">
        <h2>{{currentQuestion}}</h2>
        <ion-icon name="refresh" (click)="nextQuestion()"></ion-icon>
      </div>
    `
})

export class AlbumQuestions implements OnInit {

  currentQuestion: string = "";
  questions: string[];

  @Input() query: string;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.nextQuestion();
  }

  nextQuestion() {
    // TODO: implement a random question that avoids repetition
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
  }


}
