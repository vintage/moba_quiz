import {sample} from 'lodash';

export class GameplayService {
    public points:number;
    public streak:number;
    public lives:number;
    public progressLeft:number;

    constructor() {
        this.points = 0;
        this.streak = 0;
        this.lives = 3;
        this.refreshTimer();
    }

    private refreshTimer() {
        this.progressLeft = 1000;
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