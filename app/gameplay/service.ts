import {sample} from 'lodash';

export class GameplayService {
    public points:number;
    public streak:number;
    public lives:number;
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
        this.points = 0;
        this.streak = 0;
        this.lives = 4;
        this.level = 1;
        this.refreshTimer();
    }

    private refreshTimer() {
        let levelPenalty = parseInt(this.level / this.timeLimitUpdateInterval) * 1000;

        this.timeLimit = 15 * 1000 - levelPenalty;

        // Enforce the minimum time limit
        this.timeLimit = Math.max(this.timeLimit, this.timeLimitMin);

        this.timeLeft = this.timeLimit;
    }

    invalidMove() {
        if(this.lives > 0) {
            this.lives -= 1;
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
        return this.lives <= 0;
    }
}