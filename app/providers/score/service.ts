import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Storage, LocalStorage} from "ionic-framework/ionic";

import {ScoreModel} from "./model";

@Injectable()
export class ScoreService {
  API_URL: string = "http://mobascore-puppybox.rhcloud.com/api/v1/leaderboards/lol/scores/";
  http: Http;
  storage: Storage;

  constructor(http: Http) {
    this.http = http;
    this.storage = new Storage(LocalStorage);
  }

  hashObject(obj) {
    let keys = Object.keys(obj).sort();
    let output = [], prop;
    for (let i = 0; i < keys.length; i++) {
      prop = keys[i];
      output.push(prop);
      output.push(obj[prop]);
    }

    return JSON.stringify(output);
  }

  create(player: string, score: number, country: string) {
    let data = {
      "player_name": player,
      "value": score,
      "country_code": country,
      "platform": "ios"
    };
    data["hash"] = window.CryptoJS.SHA1(this.hashObject(data)).toString();

    return new Promise(resolve => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");

      this.http.post(
        this.API_URL, JSON.stringify(data), {headers: headers}
      ).subscribe(res => {
        // FIXME: res.ok in angular.beta7
        resolve(res.status > 200 && res.status < 300);
      });
    });
  }

  list(mode: string) {
    return new Promise(resolve => {
      this.http.get(this.API_URL + "?mode=" + mode).subscribe(res => {
        let scores = [];

        let json = res.json();
        json.map(scoreJson => {
          let score = new ScoreModel(scoreJson);
          scores.push(score);
        });

        resolve(scores);
      });
    });
  }

  getAll() {
    return this.list("all");
  }

  getDaily() {
    return this.list("daily");
  }

  getMonthly() {
    return this.list("monthly");
  }

  getWeekly() {
    return this.list("weekly");
  }

  setBestScore(score: number) {
    return this.storage.set("best_score", score);
  }

  getBestScore() {
    return this.storage.get("best_score").then(bestScore => {
      return parseInt(bestScore) || 0;
    });
  }
}
