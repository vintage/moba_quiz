import {Component} from "@angular/core";
import _ from "lodash";

import {ItemModel} from "../../../providers/item/model";
import {ItemService} from "../../../providers/item/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-item-name",
  templateUrl: "item-name.html",
})
export class ItemNameGame extends BaseGame {
  constructor(
    private items: ItemService,
    private settings: SettingsService
  ) {
    super();
  }

  getQuestion(): ItemModel {
    let item = this.items.getAny();

    return item;
  }

  getChoices(): GameChoice[] {
    let correct = this.question.getName(this.settings.getLanguageSync());
    let choices = [correct];

    while (choices.length < 4) {
      let name = this.items.getAny().getName(this.settings.getLanguageSync());
      if (choices.indexOf(name) === -1) {
        choices.push(name);
      }
    }

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
