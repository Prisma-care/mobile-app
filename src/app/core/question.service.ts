import {Injectable} from "@angular/core";
import {QUESTIONS} from "../../shared/question";

@Injectable()
export class QuestionService {

  private questions = QUESTIONS;

  constructor() {
  }

  getQuestions(query: string): string[] {

    let matchingCategories = this.questions.filter(category =>
      this.containsQuery(query, category.keywords)
    );

    if (matchingCategories.length > 0) {

      return [].concat.apply([], matchingCategories.map(mc => mc.questions));
    }
    else {
      return [];
    }
  }

  containsQuery(query: string, keywords: string[]): boolean {

    return Boolean(keywords.find(kw => {
        let reg = new RegExp(kw.toLowerCase());
        return reg.test(query.toLowerCase());
      }
    ));
  }

}
