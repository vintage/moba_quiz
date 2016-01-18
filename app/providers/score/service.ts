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

    create(player:string, score:number) {
        console.log('submit score ' + score + ' for player ' + player);

        return this.http.post('http://gamejolt.com/api/game/v1/scores/add/')
            .subscribe(res => {
              console.log(res);
                json = res.json();
                console.log(json);
                return false;
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
