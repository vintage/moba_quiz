import {Component, EventEmitter} from 'angular2/core';
import {Button} from 'ionic-framework/ionic';
import {random, sample} from 'lodash';

import {ItemService} from "../../../../providers/item/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";

@Component({
  templateUrl: 'build/pages/game/types/item_price/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [AnswerButton],
})
export class ItemPriceGame extends BaseGame {
  answerInvalid = new EventEmitter();
  answerValid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(itemService: ItemService) {
    super();
    this.itemService = itemService;
  }

  getQuestion() {
    return this.itemService.getAny();
  }

  getAnswers(question: any) {
    return [question.price];
  }

  getChoices(question: any) {
    let choiceDifferences = [
      100, 200, 250, 300, 400
    ];

    let correct = this.getAnswers(question)[0];
    let choices = [correct];

    for (let i = 0; i < 5; i++) {
      let choice = null;

      // Make unique choice
      while (choice == null || choice <= 0 || choices.indexOf(choice) != -1) {
        let anyChoice = sample(choices);
        let choiceDiff = sample(choiceDifferences);

        if (random(1)) {
          choice = anyChoice + choiceDiff;
        }
        else {
          choice = anyChoice - choiceDiff;
        }
      }

      choices.push(choice);
    }

    return choices;
  }
}
