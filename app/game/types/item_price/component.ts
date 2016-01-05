import {Component, EventEmitter} from 'angular2/core';
import {Button} from 'ionic-framework/ionic';
import {random, sample} from 'lodash';

import {ItemService} from "../../../item/service";
import {BaseGame} from "../base/component";

import {AnswerButton} from "../../answer_button/component";

@Component({
  templateUrl: 'build/game/types/item_price/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [AnswerButton],
})
export class ItemPriceGame extends BaseGame {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  getQuestion() {
    return this.itemService.GetNext();
  }

  getAnswers(question:any) {
    return [question.price];
  }

  getChoices(question:any) {
    let choiceDifferences = [
      100, 200, 250, 300, 400
    ];

    let correct = this.getAnswers(question)[0];
    let choices = [correct];

    for(let i=0; i<5; i++) {
      let choice = null;

      // Make unique choice
      while(choice == null || choices.indexOf(choice) != -1) {
        let anyChoice = sample(choices);
        let choiceDiff = sample(choiceDifferences);

        if(random(1)) {
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