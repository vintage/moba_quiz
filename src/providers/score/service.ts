import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Storage } from '@ionic/storage';

import { SettingsService } from "../settings/service";

import { ScoreModel } from "./model";

@Injectable()
export class ScoreService {
  constructor(public http: Http, private settings: SettingsService, public storage: Storage) {
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

  create(player: string, score: number, country: string, platform: string, isHardcore: boolean, metadata: Object) {
    let data = {
      "player_name": player,
      "value": score,
      "country_code": country,
      "platform": platform,
      "is_hardcore": isHardcore,
    };
    data["hash"] = window['CryptoJS']['SHA1'](this.hashObject(data)).toString();
    data["metadata"] = metadata;

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

  list(mode: string): Promise<ScoreModel[]> {
    return new Promise(resolve => {
      this.http.get(this.settings.highscoreUrl + "?mode=" + mode).subscribe(res => {
        let json = res.json();
        let scores = json.map(data => {
          return new ScoreModel(data);
        });

        resolve(scores);
      }, err => {
        resolve(null);
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

  getHardcore() {
    return this.list("hardcore");
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
