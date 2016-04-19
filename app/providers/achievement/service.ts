import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {Storage, LocalStorage} from "ionic-angular";
import {shuffle, filter, random} from "lodash";

import {AbstractAchievementModel, AchievementFactory} from "./model";

@Injectable()
export class AchievementService {
  storage: Storage;
  achievements: AbstractAchievementModel[];

  constructor(public http: Http) {
    this.storage = new Storage(LocalStorage);
  }

  update(achievementId: string, value?: any) {
    return this.load().then(achievements => {
      let achievement = achievements.filter(
        item => item.id === achievementId
      )[0];

      return this.getProgress(achievement).then(progress => {
        let newValue = achievement.update(progress, value);

        return this.setProgress(achievement, newValue);
      });
    });
  }

  getProgressKey(achievement: AbstractAchievementModel): string {
    return "achievemenet_" + achievement.id;
  }

  getProgress(achievement: AbstractAchievementModel) {
    let progressKey = this.getProgressKey(achievement);
    return this.storage.get(progressKey).then(progress => {
      return JSON.parse(progress);
    });
  }

  setProgress(achievement: AbstractAchievementModel, progress: any) {
    let progressKey = this.getProgressKey(achievement);
    return this.storage.set(progressKey, JSON.stringify(progress));
  }

  loadExtended() {
    return this.load().then(achievements => {
      achievements.forEach(achievement => {
        this.getProgress(achievement).then(progress => {
          achievement.setProgress(progress);
        });
      });

      return achievements;
    });
  }

  load() {
    if (this.achievements) {
      return Promise.resolve(this.achievements);
    }

    return new Promise(resolve => {
      this.http.get("data/achievements.json").subscribe(res => {
        this.achievements = [];

        let json = res.json();
        json.map(itemJson => {
          this.achievements.push(AchievementFactory.createAchievement(
            itemJson
          ));
        });

        resolve(this.achievements);
      });
    });
  }
}
