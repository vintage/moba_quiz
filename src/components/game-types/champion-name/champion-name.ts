import {Component} from "@angular/core";
import _ from "lodash";

import {ChampionModel} from "../../../providers/champion/model";
import {ChampionService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-name",
  templateUrl: "champion-name.html",
})
export class ChampionNameGame extends BaseGame {
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
    let correct = this.question.getName(this.settings.getLanguageSync());
    let choices = [correct];

    while (choices.length < 6) {
      let championName = this.championService.getAny().getName(this.settings.getLanguageSync());
      if (choices.indexOf(championName) === -1) {
        choices.push(championName);
      }
    }

    return _.shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
