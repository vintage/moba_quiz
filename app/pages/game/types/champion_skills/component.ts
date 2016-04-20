import {Component} from "angular2/core";

import {ChampionService} from "../../../../providers/champion/service";
import {AchievementService} from "../../../../providers/achievement/service";

import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

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

  choiceValid(item: any) {
    super.choiceValid(item);

    // Drop item from available selection
    let position = this.choices.indexOf(item);
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

  getAnswers(question: any) {
    return this.championService.getValidComponents(question).slice(0, 5);
  }

  getChoices(question: any) {
    return this.championService.getComponents(question).slice(0, 12);
  }
}
