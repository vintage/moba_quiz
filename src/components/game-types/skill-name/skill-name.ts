import {Component} from "@angular/core";
import _ from "lodash";

import {SkillModel} from "../../../providers/champion/model";
import {SkillService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-skill-name",
  templateUrl: "skill-name.html",
})
export class SkillNameGame extends BaseGame {
  constructor(
    public skills: SkillService,
    private settings: SettingsService
  ) {
    super();
  }

  getQuestion(): SkillModel {
    let item = this.skills.getAny();

    return item;
  }

  getChoices(): GameChoice[] {
    let correct = this.question.getName(this.settings.getLanguageSync());
    let choices = [correct];

    while (choices.length < 4) {
      let name = this.skills.getAny().getName(this.settings.getLanguageSync());
      if (choices.indexOf(name) === -1) {
        choices.push(name);
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
