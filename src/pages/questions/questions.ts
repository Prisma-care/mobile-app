import {Component, OnInit} from "@angular/core";
import {QUESTIONS} from "./questions.json";
import {QuestionPage} from "../question/question";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html'
})

export class QuestionsPage implements OnInit {

  categories: any[];

  constructor(private navCtrl: NavController) {
  }

  ngOnInit(): void {
    var _id = 1;
    this.categories = QUESTIONS;
  }

  showQuestion(category: any) {
    this.navCtrl.push(QuestionPage, {
      "category": category
    });
  }

}
