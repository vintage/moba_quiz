import {Component} from "@angular/core";
import {sample, sampleSize} from "lodash";

import {ChampionService} from "../../../../providers/champion/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-tag",
  templateUrl: "build/pages/game/types/champion_tag/template.html",
  directives: [Slot]
})
export class ChampionTagGame extends BaseGame {
  constructor(
    public champions: ChampionService) {
    super();
  }

  getQuestion() {
    let tags = this.champions.getTags();

    return sample(tags);
  }

  getValidOptions() {
    let options = this.champions.getAll().filter(champion => {
      return champion.tags.indexOf(this.question) !== -1;
    });

    return sampleSize(options, 1);
  }

  getInvalidOptions() {
    let options = this.champions.getAll().filter(champion => {
      return champion.tags.indexOf(this.question) === -1;
    });

    return sampleSize(options, 8);
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
