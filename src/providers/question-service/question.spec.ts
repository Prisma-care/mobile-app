// Isolated tests for the question service

import { QuestionService } from "./question.service";

describe('Question service isolated unit tests: ', () => {
  let service: QuestionService;

  beforeEach(() => { service = new QuestionService();});

  it('Exists', () => {
    expect(service).toBeDefined();
  });

  it('Returns an expected question', () => {
    let answer = service.getQuestions("Kindertijd");
    expect(answer).toContain("Hadden jullie huisdieren?");
  });

  it('Only returns the expected category', () => {
    let answer = service.getQuestions("Kindertijd");
    expect(answer.length).toBe(6);
  });

  it('Combines categories when multiple match', () => {
    let answer = service.getQuestions("gezin");
    expect(answer.length).toBeGreaterThan(6);
  });

  it('Returns null when no fitting questions exist', () => {
    let answer = service.getQuestions("flapdrol");
    expect(answer).toBeNull();  });




})
