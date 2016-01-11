import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Storage, LocalStorage} from 'ionic-framework/ionic'

import {ScoreModel} from './model';

@Injectable()
export class ScoreService {
    constructor(http:Http) {
        this.http = http;
        this.storage = new Storage(LocalStorage);
    }

    save(player:string, score:number) {
        console.log('submit score ' + score + ' for player ' + player);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }

    setBestScore(score:number) {
        return this.storage.set('best_score', score);
    }

    getBestScore() {
        return this.storage.get('best_score').then(bestScore => {
            return parseInt(bestScore) || 0;
        });
    }
}