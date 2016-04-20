import {Component} from "angular2/core";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";

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
    return this.championService.getAny();
  }

  getAnswers(question: any) {
    let answer = "Melee";
    if (question.is_range) {
      answer = "Range";
    }
    return [answer];
  }

  getChoices(question: any) {
    return ["Melee", "Range"];
  }
}
