import {EventEmitter, Output} from "@angular/core";
import _ from "lodash";

import {GameChoice} from "../../../providers/game-type/model";

export class BaseGame {
  @Output() answerInvalid: EventEmitter<any> = new EventEmitter();
  @Output() answerValid: EventEmitter<any> = new EventEmitter();
  @Output() questionFinished: EventEmitter<any> = new EventEmitter();

  question: any;
  answers: GameChoice[] = [];
  choices: GameChoice[] = [];

  getQuestion() {

  }

  getValidOptions() {
    return [];
  }

  getInvalidOptions() {
    return [];
  }

  getChoices(): GameChoice[] {
    let answersLimit = this.getAnswersLimit();
    let choicesLimit = this.getChoicesLimit();

    let validChoices = _.shuffle(this.getValidOptions().map(option => {
      return new GameChoice(option, true);
    })).slice(0, answersLimit);

    let invalidChoices = _.shuffle(this.getInvalidOptions().map(option => {
      return new GameChoice(option, false);
    })).slice(0, choicesLimit - validChoices.length);

    return _.shuffle(validChoices.concat(invalidChoices));
  }

  getAnswersLimit(): number {
    return 5;
  }

  getChoicesLimit(): number {
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
    choice.isActive = false;
    this.answerInvalid.emit(null);
  }

  isValid(choice: GameChoice): boolean {
    if (!choice) {
      return false;
    }

    return choice.isValid;
  }

  isFinished(): boolean {
    return this.choices.filter(choice => {
      return choice && choice.isValid;
    }).length === 0;
  }

  finish() {
    this.questionFinished.emit(this.question);
  }

  onChoice(choice: GameChoice) {
    if (!choice.isActive) {
      return;
    }

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

  gameOver() {
    this.choices = this.choices.map(ch => {
      if (ch && ch.isValid) {
        return ch;
      }
      else {
        return null;
      }
    });
  }
}
