import {QuestionService} from "../../providers/question-service/question.service";
import {Component, Input, OnInit} from "@angular/core";
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";

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

  constructor(protected authService: AuthService, public navCtrl: NavController, private questionService: QuestionService) {
    super(authService, navCtrl);
  }

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.questions = this.shuffle(this.questions);
    this.nextQuestion();
  }


  private questionIndex: number = 0;

  nextQuestion() {
    // TODO: implement a random question that avoids repetition
    this.currentQuestion = this.questions[this.questionIndex++ % this.questions.length];
  }

  private shuffle(array: string[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

}
