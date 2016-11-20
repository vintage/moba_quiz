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

  timerEnabled: boolean;
  isDestroyed: boolean;

  constructor(public gameplay: GameplayService) {
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
    let interval = 500;

    setTimeout(() => {
      if (this.gameplay.isOver() || this.isDestroyed) {
        return;
      }

      if (this.timerEnabled) {
        this.gameplay.timeLeft -= interval;
      }

      if (this.gameplay.timeLeft <= 0) {
        this.timeOver.emit(null);
      }

      this.updateTimer();
    }, interval);
  }
}
