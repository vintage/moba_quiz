import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {ScoreModel} from './model';

@Injectable()
export class ScoreService {
    constructor(http:Http) {
        this.http = http;
    }

    initialize() {
        //return this.http.get('data/items.json')
        //    .subscribe(res => {
        //        json = res.json();
        //        this.items = [];
        //        json.map(itemJson => {
        //            this.items.push(new ItemModel(itemJson));
        //        });
        //    });
    }

    submit(player:string, score:number) {
        console.log('submit score ' + score + ' for player ' + player);

        return true;
    }
}