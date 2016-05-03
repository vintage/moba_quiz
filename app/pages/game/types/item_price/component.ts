import {Component} from "angular2/core";
import {random, sample, shuffle} from "lodash";

import {ItemService} from "../../../../providers/item/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-item-price",
  templateUrl: "build/pages/game/types/item_price/template.html",
  directives: [AnswerButton]
})
export class ItemPriceGame extends BaseGame {
  constructor(public itemService: ItemService) {
    super();
  }

  getQuestion() {
    return this.itemService.getAny();
  }

  getChoices() {
    let choiceDifferences = [
      100, 200, 250, 300, 400
    ];

    let correct = this.question.price;
    let choices = [correct];

    for (let i = 0; i < 5; i++) {
      let choice = null;

      // Make unique choice
      while (choice == null || choice <= 0 || choices.indexOf(choice) !== -1) {
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

    return shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
