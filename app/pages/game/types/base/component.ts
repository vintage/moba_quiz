import {OnInit, EventEmitter} from 'angular2/core';
import {shuffle} from 'lodash';

export class BaseGame implements OnInit {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  public question: any;
  public answers: any[];
  public answersLeft: any[];
  public choices: any[];

  ngOnInit() {
    this.initializeGame();
  }

  getQuestion() {

  }

  getAnswers(question: any) {

  }

  getChoices(question: any) {

  }

  initializeGame() {
    this.question = this.getQuestion();

    answers = this.getAnswers(this.question);

    this.answers = [];
    this.answersLeft = [];
    for (let answer of answers) {
      this.answers.push(null);
      this.answersLeft.push(answer);
    }

    this.choices = shuffle(this.getChoices(this.question));
  }

  choiceValid(item: any) {
    let free_slot = this.answers.indexOf(null);
    if (free_slot != -1) {
      this.answers[free_slot] = item;
    }
  }

  choiceInvalid() {
    this.answerInvalid.emit();
  }

  isValid(item: any) {
    return this.answersLeft.indexOf(item) != -1;
  }

  onItemPicked(item: any) {
    let is_valid: bool = this.isValid(item);

    if (is_valid) {
      let position = this.answersLeft.indexOf(item);
      this.answersLeft.splice(position, 1);

      this.choiceValid(item);
    }
    else {
      this.choiceInvalid();
    }

    // Go to the next level
    if (this.answersLeft.length == 0) {
      this.questionFinished.emit(this.question);
    }
  }
}
