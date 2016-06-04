import {Component} from "@angular/core";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-attack-type",
  templateUrl: "build/pages/game/types/champion_attack_type/template.html",
  directives: [AnswerButton]
})
export class ChampionAttackTypeGame extends BaseGame {
  constructor(public championService: ChampionService) {
    super();
  }

  getQuestion() {
    return this.championService.getAnyWithAttackType();
  }

  getChoices() {
    let is_range = this.question.is_range;

    return [
      new GameChoice("Melee", !is_range),
      new GameChoice("Range", is_range)
    ];
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
