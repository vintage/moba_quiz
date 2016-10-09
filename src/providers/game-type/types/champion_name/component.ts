import {Component} from "@angular/core";
import _ from "lodash";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-name",
  templateUrl: "build/pages/game/types/champion_name/template.html",
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
      let championName = this.championService.getAny().name;
      if (choices.indexOf(championName) === -1) {
        choices.push(championName);
      }
    }

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
