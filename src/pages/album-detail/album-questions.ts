import {QuestionService} from "../../providers/question-service/question.service";
import {Component, Input, OnInit} from "@angular/core";
import {AuthGuard} from "../auth-guard";
import {AuthService} from "../../providers/auth-service/auth-service";
import {NavController} from "ionic-angular";
import {TranslatorService} from "../../providers/translator.service";

@Component({
  selector: 'album-questions',
  template: `
    <div class="topic-wrapper">
      <div class="topic-container" *ngIf="currentQuestion">
        <span class="topic-sub">{{ 'Onderwerp' | translate }}</span>
        <span class="topic-title">{{currentQuestion}}</span>
        <span (click)="nextQuestion()" class="topic-other">
          <ion-icon name="refresh"></ion-icon>
          &nbsp;{{ 'Ander onderwerp' | translate }}
        </span>
      </div>
    </div>
  `
})

export class AlbumQuestions extends AuthGuard implements OnInit {

  currentQuestion: string = "";
  questions: string[] = [];

  @Input() query: string;
  private questionIndex: number = 0;

  constructor(protected authService: AuthService, public navCtrl: NavController, public translatorService: TranslatorService, private questionService: QuestionService) {
    super(authService, navCtrl, translatorService);
  }

  ngOnInit(): void {
    this.questions = this.questionService.getQuestions(this.query);
    this.questions = this.shuffle(this.questions);
    this.nextQuestion();
  }

  ionViewWillEnter(): void {
    this.questions = this.shuffle(this.questions);
  }

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
