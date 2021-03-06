import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class GameplayService {
  playerName: string;
  points: number;
  strike: number;
  maxStrike: number;
  chances: number;
  level: number;
  // Time is stored in ms
  timeLimit: number;
  timeLeft: number;

  // Some configuration options. All of them should be marked as `private`.
  // Minimum amount of time given for providing answer
  private timeLimitMin: number = 7 * 1000;
  // Level count after the timer is decreased
  private timeLimitUpdateInterval = 6;

  constructor(public storage: Storage) {
    this.restart();
  }

  start() {
    this.updateTimesPlayed();
    this.restart();
  }

  restart() {
    this.points = 0;
    this.strike = 0;
    this.maxStrike = 0;
    this.chances = 4;
    this.level = 1;
    this.refreshTimer();
  }

  private updateTimesPlayed() {
    this.getTimesPlayed().then(timesPlayed => {
      return this.storage.set("times_played", timesPlayed + 1);
    });
  }

  getTimesPlayed() {
    return this.storage.get("times_played").then(timesPlayed => {
      return parseInt(timesPlayed) || 0;
    });
  }

  private refreshTimer() {
    let levelPenalty = Math.round(this.level / this.timeLimitUpdateInterval) * 1000;

    this.timeLimit = 16 * 1000 - levelPenalty;

    // Enforce the minimum time limit
    this.timeLimit = Math.max(this.timeLimit, this.timeLimitMin);

    this.timeLeft = this.timeLimit;
  }

  invalidMove() {
    if (this.chances > 0) {
      this.chances -= 1;
    }
    this.strike = 0;
  }

  getLevelPoints() {
    // Base points
    let points = 30000;

    // Time bonus
    points += Math.round((this.timeLeft / this.timeLimit) * (points * 2));

    // Strike bonus
    points += Math.min(this.strike * 600, points);

    return points;
  }

  levelPassed(isPerfect: boolean) {
    this.levelNext();

    if (isPerfect) {
      this.strike += 1;

      if (this.strike > this.maxStrike) {
        this.maxStrike = this.strike;
      }
    }

    this.points += this.getLevelPoints();
  }

  levelNext() {
    this.level += 1;
    this.refreshTimer();
  }

  isOver() {
    return this.chances <= 0 || this.timeLeft <= 0;
  }

  setPlayerName(name: string) {
    this.playerName = name;
    this.storage.set("current_player", name);
  }

  getPlayerName() {
    if (this.playerName) {
      return Promise.resolve(this.playerName);
    }

    return this.storage.get("current_player").then(playerName => {
      this.playerName = playerName;
      return playerName;
    });
  }
}
