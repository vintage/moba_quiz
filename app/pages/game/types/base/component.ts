import {OnInit, EventEmitter, Output} from "angular2/core";
import {shuffle} from "lodash";

export class BaseGame implements OnInit {
  @Output() answerInvalid: EventEmitter<any> = new EventEmitter(false);
  @Output() answerValid: EventEmitter<any> = new EventEmitter(false);
  @Output() questionFinished: EventEmitter<any> = new EventEmitter(false);

  question: any;
  answers: any[];
  answersLeft: any[];
  choices: any[];

  ngOnInit() {
    this.initializeGame();
  }

  getQuestion() {

  }

  getAnswers(question: any) {
    return [];
  }

  getChoices(question: any) {

  }

  initializeGame() {
    this.question = this.getQuestion();

    this.answers = [];
    this.answersLeft = [];
    for (let answer of this.getAnswers(this.question)) {
      this.answers.push(null);
      this.answersLeft.push(answer);
    }

    this.choices = shuffle(this.getChoices(this.question));
  }

  choiceValid(item: any) {
    let free_slot = this.answers.indexOf(null);
    if (free_slot !== -1) {
      this.answers[free_slot] = item;
    }

    this.answerValid.emit(null);
  }

  choiceInvalid() {
    this.answerInvalid.emit(null);
  }

  isValid(item: any) {
    return this.answersLeft.indexOf(item) !== -1;
  }

  isFinished() {
    return this.answersLeft.length === 0;
  }

  finish() {
    this.questionFinished.emit(this.question);
  }

  onItemPicked(item: any) {
    if (this.isFinished()) {
      return;
    }

    let is_valid: boolean = this.isValid(item);

    if (is_valid) {
      let position = this.answersLeft.indexOf(item);
      this.answersLeft.splice(position, 1);

      this.choiceValid(item);
    }
    else {
      this.choiceInvalid();
    }

    // Go to the next level
    if (this.isFinished()) {
      this.finish();
    }
  }
}
