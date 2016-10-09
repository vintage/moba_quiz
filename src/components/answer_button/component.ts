import {Component, EventEmitter, Output} from "@angular/core";

import {GameChoice} from "../types/model";

@Component({
  selector: "answer-button",
  templateUrl: "build/pages/game/answer_button/template.html",
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
