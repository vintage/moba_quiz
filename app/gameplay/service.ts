import {Storage, LocalStorage} from 'ionic-framework/ionic'

import {sample} from 'lodash';

export class GameplayService {
    public points:number;
    public streak:number;
    public chances:number;
    public level:number;
    // Time is stored in ms
    public timeLimit:number;
    public timeLeft:number;

    // Some configuration options. All of them should be marked as `private`.
    // Minimum amount of time given for providing answer
    private timeLimitMin:number = 3 * 1000;
    // Level count after the timer is decreased
    private timeLimitUpdateInterval = 5;

    constructor() {
        this.storage = new Storage(LocalStorage);

        this.restart();
    }

    public start() {
        this.updateTimesPlayed();
        this.restart();
    }

    public restart() {
        this.points = 0;
        this.streak = 0;
        this.chances = 4;
        this.level = 1;
        this.refreshTimer();
    }

    private updateTimesPlayed() {
        this.getTimesPlayed().then(timesPlayed => {
           return this.storage.set('times_played', parseInt(timesPlayed) + 1);
        });
    }

    public getTimesPlayed() {
        return this.storage.get('times_played').then(timesPlayed => {
            return timesPlayed || 0;
        });
    }

    private refreshTimer() {
        let levelPenalty = parseInt(this.level / this.timeLimitUpdateInterval) * 1000;

        this.timeLimit = 15 * 1000 - levelPenalty;

        // Enforce the minimum time limit
        this.timeLimit = Math.max(this.timeLimit, this.timeLimitMin);

        this.timeLeft = this.timeLimit;
    }

    invalidMove() {
        if(this.chances > 0) {
            this.chances -= 1;
        }
        this.streak = 0;
    }

    getLevelPoints() {
        // Base points
        let points = 250;

        // Time bonus
        points += parseInt((this.timeLeft / this.timeLimit) * 200);

        // Streak bonus
        points += this.streak * 10;

        return points;
    }

    levelPassed(isPerfect:boolean) {
        this.level += 1;

        if(isPerfect) {
            this.streak += 1;
        }

        this.points += this.getLevelPoints();
        this.refreshTimer();
    }

    isOver() {
        return this.chances <= 0 || this.timeLeft <= 0;
    }
}