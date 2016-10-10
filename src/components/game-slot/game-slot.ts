import {Component, EventEmitter, Output} from "@angular/core";

import {GameChoice} from "../../providers/game-type/model";

@Component({
  selector: "game-slot",
  templateUrl: "game-slot.html",
  inputs: ["choice"]
})
export class GameSlot {
  @Output() picked: EventEmitter<any> = new EventEmitter();

  choice: GameChoice;

  onClick() {
    if (this.choice) {
      this.picked.emit(this.choice);
    }
  }
}
