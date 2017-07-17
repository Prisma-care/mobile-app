import { Component, OnInit, Input } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

@Component({
  selector: 'page-question',
  templateUrl: 'question.html'
})

export class QuestionPage implements OnInit {

  // TODO: create a type for questions/question categories

  category : any;

  currentQuestion: any;


  @Input() description : string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.category = navParams.get("category");
  }

  ngOnInit(): void {
    this.nextQuestion();
  }

  nextQuestion() {
    // TODO: implement a random question that avoids repetition
    this.currentQuestion = this.category.questions[Math.floor(Math.random()*this.category.questions.length)];

  }

}
