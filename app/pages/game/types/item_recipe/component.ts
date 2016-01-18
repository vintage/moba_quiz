import {Component, EventEmitter} from 'angular2/core';

import {ItemService} from "../../../../providers/item/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  templateUrl: 'build/pages/game/types/item_recipe/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [Slot],
})
export class ItemRecipeGame extends BaseGame {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(itemService: ItemService) {
    this.itemService = itemService;
  }

  getQuestion() {
    return this.itemService.getAny();
  }

  getAnswers(question:any) {
    return this.itemService.getValidComponents(question);
  }

  getChoices(question:any) {
    return this.itemService.getComponents(question);
  }
}
