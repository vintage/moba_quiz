import {Component} from "angular2/core";

import {SkillService} from "../../../../providers/champion/service";
import {AchievementService} from "../../../../providers/achievement/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-skill-champion",
  templateUrl: "build/pages/game/types/skill_champion/template.html",
  directives: [Slot]
})
export class SkillChampionGame extends BaseGame {
  constructor(
    public skillService: SkillService,
    public achievements: AchievementService) {
    super();
  }

  getQuestion() {
    let question = this.skillService.getAny();

    this.achievements.update("seen_all_skills", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_skills", this.question.id);
  }

  getAnswers(question: any) {
    return this.skillService.getValidComponents(question);
  }

  getChoices(question: any) {
    return this.skillService.getComponents(question);
  }
}
