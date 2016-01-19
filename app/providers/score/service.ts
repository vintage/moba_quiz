import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Storage, LocalStorage} from 'ionic-framework/ionic'

import {ScoreModel} from './model';

@Injectable()
export class ScoreService {
  constructor(http: Http) {
    this.http = http;
    this.storage = new Storage(LocalStorage);
  }

  create(player: string, score: number, country:string) {
    return new Promise(resolve => {
      GJAPI.ScoreAddGuest (0, score, score, player, "country=" + country, (data) => {
        if(data['success'] == 'true' || data['success'] == true) {
          resolve(true);
        }
        else {
          resolve(false);
        }
      });
    });
  }

  getAll() {
    return [
      new ScoreModel("Raz", 2930198),
      new ScoreModel("Dwa", 2239481),
      new ScoreModel("Trzy", 1903913),
      new ScoreModel("Cztery", 15000)
    ];
  }

  getMonthly() {
    return this.getAll();
  }

  getWeekly() {
    return this.getAll();
  }

  setBestScore(score: number) {
    return this.storage.set('best_score', score);
  }

  getBestScore() {
    return this.storage.get('best_score').then(bestScore => {
      return parseInt(bestScore) || 0;
    });
  }
}
