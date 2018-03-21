import {Injectable} from '@angular/core';
import {QUESTIONS} from '../../shared/question';

@Injectable()
export class TopicService {
  private questions = QUESTIONS;

  constructor() {}

  getQuestions(query: string): string[] {
    const matchingCategories = this.questions.filter(category =>
      this.containsQuery(query, category.keywords)
    );

    if (matchingCategories.length > 0) {
      return [].concat.apply([], matchingCategories.map(mc => mc.questions));
    } else {
      return [];
    }
  }

  hasQuestions(query: string): boolean {
    return this.getQuestions(query).length > 0;
  }

  containsQuery(query: string, keywords: string[]): boolean {
    return Boolean(
      keywords.find(kw => {
        const reg = new RegExp(kw.toLowerCase());
        return reg.test(query.toLowerCase());
      })
    );
  }
}
