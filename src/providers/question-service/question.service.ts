import {Injectable} from "@angular/core";
import {QUESTIONS} from "./questions.json";

@Injectable()
export class QuestionService {

  private questions = QUESTIONS;

  constructor() {
  }

  getQuestions(query: string): string[] {

    let matchingCategories = this.questions.filter(category =>
      this.containsQuery(query, category.keywords)
    );

    // return questions from matching categories
    if (matchingCategories.length > 0) {

      // a flatmap from [ {"questions": ["q1", "q2", ... ] }, { ... }, { ...}] to [ "q1", "q2", .., "qx"]
      return [].concat.apply([], matchingCategories.map(mc => mc.questions));
    }
    else {
      return [];
    }
  }

  /*  keywords ==> questions

   if query name consists of any of the keywords, find the questions

   => regex for each question-category - temp but easy solution*/

  /*
   A function that get a single query string,
   and checks whether one of some given keywords can be found in it.
   Note: not capital sensitive
   */

  private containsQuery(query: string, keywords: string[]): boolean {

    return Boolean(keywords.find(kw => {
        let reg = new RegExp(kw.toLowerCase());
        return reg.test(query.toLowerCase());
      }
    ));
  }

}
