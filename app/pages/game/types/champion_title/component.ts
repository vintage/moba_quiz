import {Component} from "@angular/core";
import {shuffle} from "lodash";

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";
import {GameChoice} from "../model";

@Component({
  selector: "game-champion-title",
  templateUrl: "build/pages/game/types/champion_title/template.html",
  directives: [AnswerButton]
})
export class ChampionTitleGame extends BaseGame {
  constructor(public championService: ChampionService) {
    super();
  }

  getQuestion() {
    return this.championService.getAny();
  }

  getChoices() {
    let correct = this.question.title;
    let choices = [correct];

    while (choices.length < 6) {
      let championTitle = this.championService.getAny().title;
      if (choices.indexOf(championTitle) === -1) {
        choices.push(championTitle);
      }
    }

    return shuffle(choices.map(choice => {
      return new GameChoice(choice, choice === correct);
    }));
  }

  isFinished() {
    return this.answers.length > 0;
  }
}
