import {Component, EventEmitter} from "angular2/core";
import {Button} from "ionic-angular";

import {GameChoice} from "../types/model";

@Component({
  selector: "answer-button",
  templateUrl: "build/pages/game/answer_button/template.html",
  directives: [Button],
  inputs: ["choice"],
  outputs: ["picked"],
})
export class AnswerButton {
  choice: GameChoice;
  picked = new EventEmitter();

  onClick() {
    this.picked.emit(this.choice);
  }
}
