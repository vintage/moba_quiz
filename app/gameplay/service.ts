import {sample} from 'lodash';

export class GameplayService {
    public points:number;
    public streak:number;
    public lives:number;

    constructor() {
        this.points = 0;
        this.streak = 0;
        this.lives = 3;
    }

    invalidMove() {
        this.lives -= 1;
    }

    validMove() {
        this.points += 1;
    }

    isOver() {
        return this.lives <= 0;
    }
}