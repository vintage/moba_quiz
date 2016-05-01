import {Component, EventEmitter, Output} from "angular2/core";

import {ItemModel} from "../../../providers/item/model";
import {GameChoice} from "../types/model";

@Component({
  selector: "game-slot",
  templateUrl: "build/pages/game/slot/template.html",
  inputs: ["choice"]
})
export class Slot {
  @Output() picked: EventEmitter<any> = new EventEmitter(false);

  choice: GameChoice;

  onClick() {
    if (this.choice) {
      this.picked.emit(this.choice);
    }
  }
}
