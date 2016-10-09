import {Component} from "@angular/core";

import {ItemService} from "../../../../providers/item/service";
import {AchievementService} from "../../../../providers/achievement/service";
import {BaseGame} from "../base/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-item-recipe",
  templateUrl: "build/pages/game/types/item_recipe/template.html",
})
export class ItemRecipeGame extends BaseGame {
  constructor(
    public itemService: ItemService,
    public achievements: AchievementService) {
    super();
  }

  choiceValid(choice: GameChoice) {
    super.choiceValid(choice);

    // Drop item from available selection
    // TODO: Nie zadziala jesli jest kilka takich samych itemow na planszy
    let position = this.choices.indexOf(choice);
    this.choices[position] = null;
  }

  getQuestion() {
    let question = this.itemService.getAny();

    this.achievements.update("seen_all_items", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_items", this.question.id);
  }

  getValidOptions() {
    return this.itemService.getValidComponents(this.question);
  }

  getInvalidOptions() {
    return this.itemService.getInvalidComponents(
      this.question, this.getChoicesLimit()
    );
  }

  getAnswersLimit() {
    return 5;
  }

  getChoicesLimit() {
    return 12;
  }
}
