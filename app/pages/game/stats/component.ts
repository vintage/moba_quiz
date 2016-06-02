import {Component, EventEmitter, OnInit} from "@angular/core";
import {Icon} from "ionic-angular";

import {GameplayService} from "../../../providers/gameplay/service";
import {PointsPipe, TimeLeftPipe} from "../../../pipes/numbers";

@Component({
  selector: "game-stats",
  templateUrl: "build/pages/game/stats/template.html",
  directives: [Icon],
  inputs: ["timerEnabled"],
  outputs: ["timeOver"],
  pipes: [PointsPipe, TimeLeftPipe]
})
export class Stats implements OnInit {
  timeOver = new EventEmitter();

  progressCur: number;
  timerEnabled: boolean;

  constructor(public gameplay: GameplayService) {
    this.progressCur = this.gameplay.timeLimit / 1000;
    this.timerEnabled = true;
  }

  ngOnInit() {
    this.updateTimer();
  }

  updateTimer() {
    let interval = 1000;

    setTimeout(() => {
      if (this.timerEnabled) {
        this.gameplay.timeLeft -= interval;
      }

      this.progressCur = Math.max(this.gameplay.timeLeft / 1000, 0);

      if (this.gameplay.timeLeft === 0) {
        this.timeOver.emit(null);
      }

      if (!this.gameplay.isOver()) {
        this.updateTimer();
      }
    }, interval);
  }
}
