import {Component} from "@angular/core";
import _ from "lodash";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-nation",
  templateUrl: "build/pages/game/types/champion_nation/template.html",
})
export class ChampionNationGame extends BaseGame {
  constructor(public championService: ChampionService) {
    super();
  }

  getQuestion() {
    return this.championService.getAny();
  }

  getChoices() {
    let correct = this.question.nation;
    let choices = this.championService.getNations().filter(node => {
      return node !== correct;
    }).slice(0, 5);
    choices.push(correct);

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
