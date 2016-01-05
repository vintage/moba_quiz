import {Component, EventEmitter} from 'angular2/core';

import {SkillService} from "../../../champion/service";
import {Slot} from "../../slot/component";
import {BaseGame} from "../base/component";

@Component({
  templateUrl: 'build/game/types/skill_champion/template.html',
  outputs: ['answerInvalid', 'questionFinished'],
  directives: [Slot],
})
export class SkillChampionGame extends BaseGame {
  answerInvalid = new EventEmitter();
  questionFinished = new EventEmitter();

  constructor(skillService: SkillService) {
    this.skillService = skillService;
  }

  getQuestion() {
    return this.skillService.GetNext();
  }

  getAnswers(question:any) {
    return this.skillService.GetValidComponents(question);
  }

  getChoices(question:any) {
    return this.skillService.GetComponents(question);
  }
}