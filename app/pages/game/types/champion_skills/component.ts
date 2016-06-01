import {Component} from "angular2/core";

import {ChampionService} from "../../../../providers/champion/service";
import {AchievementService} from "../../../../providers/achievement/service";

import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-skills",
  templateUrl: "build/pages/game/types/champion_skills/template.html",
  directives: [Slot]
})
export class ChampionSkillsGame extends BaseGame {
  constructor(
    public championService: ChampionService,
    public achievements: AchievementService) {
    super();
  }

  choiceValid(choice: GameChoice) {
    super.choiceValid(choice);

    // Drop item from available selection
    let position = this.choices.indexOf(choice);
    this.choices[position] = null;
  }

  getQuestion() {
    let question = this.championService.getAny();

    this.achievements.update("seen_all_champions", question.id);

    return question;
  }

  finish() {
    super.finish();

    this.achievements.update("solved_all_champions", this.question.id);
  }

  getValidOptions() {
    return this.championService.getValidComponents(this.question);
  }

  getInvalidOptions() {
    return this.championService.getInvalidComponents(
      this.question, this.getChoicesLimit()
    );
  }

  getAnswersLimit() {
    return 5;
  }

  getChoicesLimit() {
    return 12;
  }
}
