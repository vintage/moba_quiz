import {Component} from "@angular/core";
import _ from "lodash";

import {ItemService} from "../../../../providers/item/service";
import {GameplayService} from "../../../../providers/gameplay/service";

import {BaseGame} from "../base/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-item-price",
  templateUrl: "build/pages/game/types/item_price/template.html",
})
export class ItemPriceGame extends BaseGame {
  constructor(private items: ItemService, private gameplay: GameplayService) {
    super();
  }

  getQuestion() {
    let item = this.items.getBase();

    return item;
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
        let anyChoice = _.sample(choices);
        let choiceDiff = _.sample(choiceDifferences);

        if (_.random(1)) {
          choice = anyChoice + choiceDiff;
        }
        else {
          choice = anyChoice - choiceDiff;
        }
      }

      choices.push(choice);
    }

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
