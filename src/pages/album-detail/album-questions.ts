import { QuestionService } from "../../providers/question-service/question.service";
import { OnInit, Component, Input } from "@angular/core";
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";

@Component({
  selector: 'album-questions',
  template: `
      <div class="page-header" *ngIf="currentQuestion">
        <div (click)="nextQuestion()">
          <h2>{{currentQuestion}}</h2>
          <ion-icon name="refresh"></ion-icon>
        </div>
      </div>
    `
})

export class AlbumQuestions extends AuthGuard implements OnInit {

  currentQuestion: string = "";
  questions: string[] = [];

  @Input() query: string;

  constructor(protected authService: AuthService,private questionService: QuestionService) {super(authService);}

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.nextQuestion();
  }

  nextQuestion() {
    // TODO: implement a random question that avoids repetition
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
  }


}
