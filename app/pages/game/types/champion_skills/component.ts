import {Component, EventEmitter} from 'angular2/core';

import {ChampionService} from "../../../../providers/champion/service";

import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  templateUrl: 'build/pages/game/types/champion_skills/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [Slot],
})
export class ChampionSkillsGame extends BaseGame {
  answerInvalid = new EventEmitter();
  answerValid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(championService: ChampionService) {
    super();
    this.championService = championService;
  }

  choiceValid(item:any) {
    super.choiceValid(item);

    // Drop item from available selection
    let position = this.choices.indexOf(item);
    this.choices[position] = null;
  }

  getQuestion() {
    return this.championService.getAny();
  }

  getAnswers(question: any) {
    return this.championService.getValidComponents(question).slice(0, 5);
  }

  getChoices(question: any) {
    return this.championService.getComponents(question).slice(0, 12);
  }
}
