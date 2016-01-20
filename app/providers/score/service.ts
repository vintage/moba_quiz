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
    return new Promise(resolve => {
      GJAPI.ScoreFetch (0, false, 100, (data) => {
        let scores = [];
        data["scores"].map(scoreObj => {
          scores.push(new ScoreModel(
            scoreObj['score'],
            scoreObj['guest'],
            scoreObj['extra_data'].replace("country=", "")
          ));
        })
        resolve(scores);
      });
    });
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
