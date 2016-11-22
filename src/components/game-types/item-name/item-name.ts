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
    let items = this.items.getAll().filter(i => {
      return i.id !== this.question.id;
    });

    let choices = _.sampleSize(items, 3);
    choices.push(this.question);

    return _.shuffle(choices.map(choice => {
      return new GameChoice(
        choice.getName(this.settings.getLanguageSync()),
        choice.id === this.question.id
      );
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
