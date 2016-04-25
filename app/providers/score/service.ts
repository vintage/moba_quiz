import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import {Storage, SqlStorage} from "ionic-angular";

import {SettingsService} from "../settings/service";

import {ScoreModel} from "./model";

@Injectable()
export class ScoreService {
  storage: Storage;

  constructor(public http: Http, private settings: SettingsService) {
    this.storage = new Storage(SqlStorage);
  }

  hashObject(obj) {
    let keys = Object.keys(obj).sort();
    let output = [], prop;
    for (let i = 0; i < keys.length; i++) {
      prop = keys[i];
      output.push(prop);
      output.push(obj[prop]);
    }

    return JSON.stringify(output).toLowerCase().replace(/[^a-z0-9]/gi, "");
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
        this.settings.highscoreUrl, JSON.stringify(data), {headers: headers}
      ).subscribe(res => {
        // FIXME: res.ok in angular.beta7
        resolve(res.status > 200 && res.status < 300);
      });
    });
  }

  list(mode: string) {
    return new Promise(resolve => {
      this.http.get(this.settings.highscoreUrl + "?mode=" + mode).subscribe(res => {
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
