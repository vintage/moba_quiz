import {Component, EventEmitter, Output} from "@angular/core";

import {GameChoice} from "../../providers/game-type/model";

@Component({
  selector: "answer-button",
  templateUrl: "answer-button.html",
  inputs: ["choice"]
})
export class AnswerButton {
  @Output() picked: EventEmitter<any> = new EventEmitter(false);

  choice: GameChoice;

  onClick() {
    if (this.choice) {
      this.picked.emit(this.choice);
    }
  }
}
