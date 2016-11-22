import {Component} from "@angular/core";
import _ from "lodash";

import {ItemModel} from "../../../providers/item/model";
import {ItemService} from "../../../providers/item/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-item-price",
  templateUrl: "item-price.html",
})
export class ItemPriceGame extends BaseGame {
  constructor(
    private items: ItemService,
    private settings: SettingsService
  ) {
    super();
  }

  getQuestion(): ItemModel {
    let item = this.items.getPurchasable();

    return item;
  }

  getChoices(): GameChoice[] {
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
      return new GameChoice(choice.toString(), choice === correct);
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
