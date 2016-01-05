import {Component, EventEmitter} from 'angular2/core';

import {ChampionService} from "../../../champion/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  templateUrl: 'build/game/types/champion_skills/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [Slot],
})
export class ChampionSkillsGame extends BaseGame {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(championService: ChampionService) {
    this.championService = championService;
  }

  getQuestion() {
    return this.championService.GetNext();
  }

  getAnswers(question:any) {
    console.log(this.championService.GetValidComponents(question));
    return this.championService.GetValidComponents(question);
  }

  getChoices(question:any) {
    console.log(this.championService.GetComponents(question));
    return this.championService.GetComponents(question);
  }
}