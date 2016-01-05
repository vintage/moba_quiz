import {Component} from 'angular2/core';

import {GameplayService} from "../../gameplay/service";

@Component({
  selector: 'game-stats',
  templateUrl: 'build/game/stats/template.html'
})
export class Stats {
  public gameplay:GameplayService;

  constructor(gameplayService: GameplayService) {
    this.gameplay = gameplayService;
  }
}