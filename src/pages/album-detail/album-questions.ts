import {QuestionService} from "../../providers/question-service/question.service";
import {Component, Input, OnInit} from "@angular/core";
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";
import {TranslatorService} from "../../providers/translator.service";

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

  constructor(protected authService: AuthService, public navCtrl: NavController, public translatorService: TranslatorService,private questionService: QuestionService) {
    super(authService, navCtrl,translatorService);
  }

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.nextQuestion();
  }

  nextQuestion() {
    // TODO: implement a random question that avoids repetition
    this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
  }


}
