import {Component} from "angular2/core";

import {SkillService} from "../../../../providers/champion/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  selector: "game-skill-champion",
  templateUrl: "build/pages/game/types/skill_champion/template.html",
  directives: [Slot]
})
export class SkillChampionGame extends BaseGame {
  constructor(public skillService: SkillService) {
    super();
  }

  getQuestion() {
    return this.skillService.getAny();
  }

  getAnswers(question: any) {
    return this.skillService.getValidComponents(question);
  }

  getChoices(question: any) {
    return this.skillService.getComponents(question);
  }
}
