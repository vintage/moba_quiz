import {Component} from "@angular/core";

import {AchievementService} from "../../../providers/achievement/service";
import {ChampionModel, SkillModel} from "../../../providers/champion/model";
import {ChampionService} from "../../../providers/champion/service";
import {GameChoice} from "../../../providers/game-type/model";
import {SettingsService} from "../../../providers/settings/service";

import {BaseGame} from "../base/component";

@Component({
  selector: "game-champion-skills",
  templateUrl: "champion-skills.html",
})
export class ChampionSkillsGame extends BaseGame {
  constructor(
    public championService: ChampionService,
    public achievements: AchievementService,
    private settings: SettingsService
  ) {
    super();
  }

  choiceValid(choice: GameChoice) {
    super.choiceValid(choice);

    // Drop item from available selection
    let position = this.choices.indexOf(choice);
    this.choices[position] = null;
  }

  getQuestion(): ChampionModel {
    let question = this.championService.getAny();

    this.achievements.update("seen_all_champions", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_champions", this.question.id);
  }

  getValidOptions(): SkillModel[] {
    return this.championService.getValidComponents(this.question);
  }

  getInvalidOptions(): SkillModel[] {
    return this.championService.getInvalidComponents(
      this.question, this.getChoicesLimit()
    );
  }

  getAnswersLimit(): number {
    return 5;
  }

  getChoicesLimit(): number {
    return 12;
  }
}
