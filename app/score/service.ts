import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {ScoreModel} from './model';

@Injectable()
export class ScoreService {
    constructor(http:Http) {
        this.http = http;
    }

    save(player:string, score:number) {
        console.log('submit score ' + score + ' for player ' + player);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }
}