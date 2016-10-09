import {OnInit, EventEmitter, Output} from "@angular/core";
import _ from "lodash";

import {GameChoice} from "../model";

export class BaseGame implements OnInit {
  @Output() answerInvalid: EventEmitter<any> = new EventEmitter(false);
  @Output() answerValid: EventEmitter<any> = new EventEmitter(false);
  @Output() questionFinished: EventEmitter<any> = new EventEmitter(false);

  question: any;
  answers: GameChoice[];
  choices: GameChoice[];

  ngOnInit() {
    this.initializeGame();
  }

  getQuestion() {

  }

  getValidOptions() {
    return [];
  }

  getInvalidOptions() {
    return [];
  }

  getChoices() {
    let answersLimit = this.getAnswersLimit();
    let choicesLimit = this.getChoicesLimit();

    let validChoices = shuffle(this.getValidOptions().map(option => {
      return new GameChoice(option, true);
    })).slice(0, answersLimit);

    let invalidChoices = shuffle(this.getInvalidOptions().map(option => {
      return new GameChoice(option, false);
    })).slice(0, choicesLimit - validChoices.length);

    return _.shuffle(validChoices.concat(invalidChoices));
  }

  getAnswersLimit() {
    return 5;
  }

  getChoicesLimit() {
    return 12;
  }

  initializeGame() {
    this.question = this.getQuestion();
    this.answers = [];
    this.choices = this.getChoices();
  }

  choiceValid(choice: GameChoice) {
    this.answers.push(choice);

    this.answerValid.emit(null);
  }

  choiceInvalid(choice: GameChoice) {
    this.answerInvalid.emit(null);
  }

  isValid(choice: GameChoice) {
    return choice.isValid;
  }

  isFinished() {
    return this.choices.filter(choice => {
      return choice && choice.isValid;
    }).length === 0;
  }

  finish() {
    this.questionFinished.emit(this.question);
  }

  onChoice(choice: GameChoice) {
    if (this.isFinished()) {
      return;
    }

    let is_valid: boolean = this.isValid(choice);

    if (is_valid) {
      this.choiceValid(choice);
    }
    else {
      this.choiceInvalid(choice);
    }

    // Go to the next level
    if (this.isFinished()) {
      this.finish();
    }
  }
}
