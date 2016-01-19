import {Component, EventEmitter, OnInit} from 'angular2/core';

import {GameplayService} from "../../../providers/gameplay/service";

@Component({
  selector: 'game-stats',
  templateUrl: 'build/pages/game/stats/template.html',
  outputs: ['timeOver']
})
export class Stats implements OnInit {
  timeOver = new EventEmitter();

  public progressMax: number;

  constructor(gameplayService: GameplayService) {
    this.gameplay = gameplayService;
    this.progressMax = 1000;
  }

  ngOnInit() {
    this.updateTimer();
  }

  currentProgress() {
    return (this.gameplay.timeLeft / this.gameplay.timeLimit) * this.progressMax;
  }

  updateTimer() {
    let interval = 100;

    setTimeout(() => {
      this.gameplay.timeLeft -= interval;
      if (this.gameplay.timeLeft == 0) {
        this.timeOver.emit();
      }

      if (!this.gameplay.isOver()) {
        this.updateTimer();
      }
    }, interval);
  }
}
