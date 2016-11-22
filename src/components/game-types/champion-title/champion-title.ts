import {Component} from "@angular/core";
import _ from "lodash";

import {ChampionModel} from "../../../providers/champion/model";
import {ChampionService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-title",
  templateUrl: "champion-title.html",
})
export class ChampionTitleGame extends BaseGame {
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
    let champions = this.championService.getAll().filter(c => {
      return c.id !== this.question.id;
    });

    let choices = _.sampleSize(champions, 3);
    choices.push(this.question);

    return _.shuffle(choices.map(choice => {
      return new GameChoice(
        choice.getTitle(this.settings.getLanguageSync()),
        choice.id === this.question.id
      );
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
