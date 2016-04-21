import {Component, EventEmitter, OnInit} from "angular2/core";
import {Icon} from "ionic-angular";

import {GameplayService} from "../../../providers/gameplay/service";
import {PointsPipe} from "../../../pipes/numbers";

@Component({
  selector: "game-stats",
  templateUrl: "build/pages/game/stats/template.html",
  directives: [Icon],
  inputs: ["timerEnabled"],
  outputs: ["timeOver"],
  pipes: [PointsPipe]
})
export class Stats implements OnInit {
  timeOver = new EventEmitter();

  progressMax: number;
  timerEnabled: boolean;

  constructor(public gameplay: GameplayService) {
    this.progressMax = 1000;
    this.timerEnabled = true;
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
      if (this.timerEnabled) {
        this.gameplay.timeLeft -= interval;
      }

      if (this.gameplay.timeLeft === 0) {
        this.timeOver.emit(null);
      }

      if (!this.gameplay.isOver()) {
        this.updateTimer();
      }
    }, interval);
  }
}
