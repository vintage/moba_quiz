import {Component} from "@angular/core";

import {AchievementService} from "../../../providers/achievement/service";
import {ChampionModel, SkillModel} from "../../../providers/champion/model";
import {SkillService} from "../../../providers/champion/service";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-skill-champion",
  templateUrl: "skill-champion.html",
})
export class SkillChampionGame extends BaseGame {
  constructor(
    public skillService: SkillService,
    public achievements: AchievementService,
    private settings: SettingsService
  ) {
    super();
  }

  getQuestion(): SkillModel {
    let question = this.skillService.getAny();

    this.achievements.update("seen_all_skills", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_skills", this.question.id);
  }

  getValidOptions(): ChampionModel[] {
    return this.skillService.getValidComponents(this.question);
  }

  getInvalidOptions(): ChampionModel[] {
    return this.skillService.getInvalidComponents(
      this.question, this.getChoicesLimit()
    );
  }

  getAnswersLimit(): number {
    return 1;
  }

  getChoicesLimit(): number {
    return 9;
  }

  isFinished(): boolean {
    return this.answers.length > 0;
  }
}
