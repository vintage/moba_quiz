import {Component} from "@angular/core";
import _ from "lodash";

import {ChampionModel} from "../../../providers/champion/model";
import {ChampionService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-nation",
  templateUrl: "champion-nation.html",
})
export class ChampionNationGame extends BaseGame {
  constructor(
    public championService: ChampionService,
    private settings: SettingsService
  ) {
    super();
  }

  getQuestion(): ChampionModel {
    return this.championService.getAny();
  }

  getChoices(): GameChoice[] {
    let correct = this.question.nation;
    let choices = this.championService.getNations().filter(node => {
      return node !== correct;
    }).slice(0, 3);
    choices.push(correct);

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
