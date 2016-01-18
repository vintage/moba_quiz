import {Component, EventEmitter} from 'angular2/core';

import {ChampionService} from "../../../../providers/champion/service";

import {BaseGame} from "../base/component";
import {AnswerButton} from "../../answer_button/component";

@Component({
  templateUrl: 'build/pages/game/types/champion_attack_type/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [AnswerButton],
})
export class ChampionAttackTypeGame extends BaseGame {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(championService: ChampionService) {
    this.championService = championService;
  }

  getQuestion() {
    return this.championService.getAny();
  }

  getAnswers(question:any) {
    let answer = 'Melee';
    if(question.is_range) {
      answer = 'Range';
    }
    return [answer];
  }

  getChoices(question:any) {
    return ['Melee', 'Range'];
  }
}
