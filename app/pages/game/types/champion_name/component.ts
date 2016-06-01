import {Component} from "angular2/core";
import {shuffle} from "lodash";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-name",
  templateUrl: "build/pages/game/types/champion_name/template.html",
  directives: [AnswerButton]
})
export class ChampionNameGame extends BaseGame {
  constructor(public championService: ChampionService) {
    super();
  }

  getQuestion() {
    return this.championService.getAny();
  }

  getChoices() {
    let correct = this.question.name;
    let choices = [correct];

    while (choices.length < 6) {
      let champion_name = this.championService.getAny().name;
      if (choices.indexOf(champion_name) === -1) {
        choices.push(champion_name);
      }
    }

    return shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
