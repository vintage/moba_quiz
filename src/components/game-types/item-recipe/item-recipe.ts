import {Component} from "@angular/core";

import {AchievementService} from "../../../providers/achievement/service";
import {ItemModel} from "../../../providers/item/model";
import {ItemService} from "../../../providers/item/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-item-recipe",
  templateUrl: "item-recipe.html",
})
export class ItemRecipeGame extends BaseGame {
  constructor(
    public itemService: ItemService,
    public achievements: AchievementService,
    private settings: SettingsService
  ) {
    super();
  }

  choiceValid(choice: GameChoice) {
    super.choiceValid(choice);

    // Drop item from available selection
    // TODO: Nie zadziala jesli jest kilka takich samych itemow na planszy
    let position = this.choices.indexOf(choice);
    this.choices[position] = null;
  }

  getQuestion(): ItemModel {
    let question = this.itemService.getComplex();

    this.achievements.update("seen_all_items", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_items", this.question.id);
  }

  getValidOptions(): ItemModel[] {
    return this.itemService.getValidComponents(this.question);
  }

  getInvalidOptions(): ItemModel[] {
    return this.itemService.getInvalidComponents(
      this.question, this.getChoicesLimit()
    );
  }

  getAnswersLimit(): number {
    return 5;
  }

  getChoicesLimit(): number {
    return 12;
  }
}
