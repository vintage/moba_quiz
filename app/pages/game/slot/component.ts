import {Component, EventEmitter} from "angular2/core";

import {ItemModel} from "../../../providers/item/model";

@Component({
  selector: "game-slot",
  templateUrl: "build/pages/game/slot/template.html",
  inputs: ["item"],
  outputs: ["picked"],
})
export class Slot {
  emptyImageSource: string = "data/images/items/3041.png";
  item: ItemModel;
  picked = new EventEmitter();

  onClick() {
    if (this.item) {
      this.picked.emit(this.item);
    }
  }
}
