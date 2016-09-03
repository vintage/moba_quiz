import {Component} from "@angular/core";
import {sampleSize} from "lodash";

import {ChampionService} from "../../../../providers/champion/service";
import {AnswerButton} from "../../answer_button/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-tag",
  templateUrl: "build/pages/game/types/tag_champion/template.html",
  directives: [AnswerButton]
})
export class TagChampionGame extends BaseGame {
  constructor(
    public champions: ChampionService) {
    super();
  }

  getQuestion() {
    let question = this.champions.getAnyWithTag();

    return question;
  }

  getValidOptions() {
    return sampleSize(this.question.tags, 1);
  }

  getInvalidOptions() {
    let options = this.champions.getTags().filter(tag => {
      return this.question.tags.indexOf(tag) === -1;
    });

    return sampleSize(options, 6);
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
