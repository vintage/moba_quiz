import {Component, EventEmitter} from "angular2/core";

import {ItemService} from "../../../../providers/item/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-item-recipe",
  templateUrl: "build/pages/game/types/item_recipe/template.html",
  outputs: ["answerInvalid", "questionFinished"],
  directives: [Slot],
})
export class ItemRecipeGame extends BaseGame {
  answerInvalid = new EventEmitter();
  answerValid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(public itemService: ItemService) {
    super();
  }

  choiceValid(item:any) {
    super.choiceValid(item);

    // Drop item from available selection
    // TODO: Nie zadziala jesli jest kilka takich samych itemow na planszy
    let position = this.choices.indexOf(item);
    this.choices[position] = null;
  }

  getQuestion() {
    return this.itemService.getAny();
  }

  getAnswers(question: any) {
    return this.itemService.getValidComponents(question);
  }

  getChoices(question: any) {
    return this.itemService.getComponents(question);
  }
}
