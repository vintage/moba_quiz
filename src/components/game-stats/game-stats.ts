import {Component, EventEmitter, OnInit} from "@angular/core";

import {GameplayService} from "../../providers/gameplay/service";

@Component({
  selector: "game-stats",
  templateUrl: "game-stats.html",
  inputs: ["timerEnabled"],
  outputs: ["timeOver"],
})
export class GameStats implements OnInit {
  timeOver = new EventEmitter();

  progressCur: number;
  timerEnabled: boolean;
  isDestroyed: boolean;

  constructor(public gameplay: GameplayService) {
    this.progressCur = this.gameplay.timeLimit / 1000;
    this.timerEnabled = true;
  }

  ngOnInit() {
    this.updateTimer();
    this.isDestroyed = false;
  }

  ngOnDestroy() {
    this.isDestroyed = true;
  }

  updateTimer() {
    let interval = 1000;

    setTimeout(() => {
      if (this.gameplay.isOver() || this.isDestroyed) {
        return;
      }

      if (this.timerEnabled) {
        this.gameplay.timeLeft -= interval;
      }

      this.progressCur = Math.max(this.gameplay.timeLeft / 1000, 0);

      if (this.gameplay.timeLeft <= 0) {
        this.timeOver.emit(null);
      }

      this.updateTimer();
    }, interval);
  }
}
