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
    let skills = this.skills.getAll().filter(s => {
      return s.id !== this.question.id;
    });

    let choices = _.sampleSize(skills, 3);
    choices.push(this.question);

    return _.shuffle(choices.map(choice => {
      return new GameChoice(
        choice.getName(this.settings.getLanguageSync()),
        choice.id === this.question.id
      );
    }));
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
