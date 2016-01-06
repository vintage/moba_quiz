import {sample} from 'lodash';

export class GameplayService {
    public points:number;
    public streak:number;
    public lives:number;
    // Given in ms
    public timeLimit:number;
    public timeLeft:number;

    constructor() {
        this.points = 0;
        this.streak = 0;
        this.lives = 3;
        this.refreshTimer();
    }

    private refreshTimer() {
        this.timeLimit = 15 * 1000;
        this.timeLeft = this.timeLimit;
    }

    invalidMove() {
        this.lives -= 1;
    }

    levelPassed() {
        this.refreshTimer();
    }

    isOver() {
        return this.lives <= 0;
    }
}