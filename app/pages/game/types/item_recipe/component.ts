import {Component} from "angular2/core";

import {ItemService} from "../../../../providers/item/service";
import {AchievementService} from "../../../../providers/achievement/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-item-recipe",
  templateUrl: "build/pages/game/types/item_recipe/template.html",
  directives: [Slot]
})
export class ItemRecipeGame extends BaseGame {
  constructor(
    public itemService: ItemService,
    public achievements: AchievementService) {
    super();
  }

  choiceValid(item: any) {
    super.choiceValid(item);

    // Drop item from available selection
    // TODO: Nie zadziala jesli jest kilka takich samych itemow na planszy
    let position = this.choices.indexOf(item);
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

  getAnswers(question: any) {
    return this.itemService.getValidComponents(question);
  }

  getChoices(question: any) {
    return this.itemService.getComponents(question);
  }
}
