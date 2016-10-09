import {Component} from "@angular/core";

import {ChampionModel} from "../../../providers/champion/model";
import {ChampionService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-attack-type",
  templateUrl: "champion-attack-type.html",
})
export class ChampionAttackTypeGame extends BaseGame {
  constructor(public championService: ChampionService) {
    super();
  }

  getQuestion(): ChampionModel {
    return this.championService.getAnyWithAttackType();
  }

  getChoices(): GameChoice[] {
    let is_range = this.question.is_range;

    return [
      new GameChoice("Melee", !is_range),
      new GameChoice("Range", is_range)
    ];
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
