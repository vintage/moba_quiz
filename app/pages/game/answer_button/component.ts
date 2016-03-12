import {Component, EventEmitter} from "angular2/core";
import {Button} from "ionic-angular";

@Component({
  selector: "answer-button",
  templateUrl: "build/pages/game/answer_button/template.html",
  directives: [Button],
  inputs: ["value"],
  outputs: ["picked"],
})
export class AnswerButton {
  value: any;
  picked = new EventEmitter();

  onClick() {
    this.picked.emit(this.value);
  }
}
