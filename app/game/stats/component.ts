import {Component, EventEmitter, OnInit} from 'angular2/core';

import {GameplayService} from "../../gameplay/service";

@Component({
  selector: 'game-stats',
  templateUrl: 'build/game/stats/template.html',
  outputs: ['timeOver']
})
export class Stats implements OnInit {
  timeOver = new EventEmitter();

  public gameplay:GameplayService;

  constructor(gameplayService: GameplayService) {
    this.gameplay = gameplayService;
  }

  ngOnInit() {
    this.updateTimer();
  }

  currentProgress() {
    return this.gameplay.progressLeft;
  }

  updateTimer() {
    setTimeout(() => {
      this.gameplay.progressLeft -= 10;
      if(this.gameplay.progressLeft == 0) {
        this.timeOver.emit();
      }
      this.updateTimer();
    }, 100);
  }
}