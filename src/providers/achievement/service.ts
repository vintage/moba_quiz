import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Storage } from '@ionic/storage';

import { AbstractAchievementModel, AchievementFactory } from "./model";

@Injectable()
export class AchievementService {
  achievements: AbstractAchievementModel[];

  constructor(public http: Http, public storage: Storage) {
  }

  update(achievementId: string, value?: any) {
    return this.load().then(achievements => {
      let achievement = achievements.filter(item => {
        return item.id === achievementId;
      })[0];

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
    let progress_key = this.getProgressKey(achievement);
    return this.storage.get(progress_key).then(progress => {
      if (!progress) {
        return 0;
      }
      return JSON.parse(progress);
    });
  }

  setProgress(achievement: AbstractAchievementModel, progress: any) {
    let progress_key = this.getProgressKey(achievement);
    return this.storage.set(progress_key, JSON.stringify(progress));
  }

  loadExtended() {
    return this.load().then(achievements => {
      let promises = [];
      achievements.forEach(achievement => {
        promises.push(new Promise(resolve => {
          return this.getProgress(achievement).then(progress => {
            achievement.setProgress(progress);
            return resolve(achievement);
          });
        }));
      });

      return Promise.all(promises).then(value => {
        return value;
      });
    });
  }

  load() {
    if (this.achievements) {
      return Promise.resolve(this.achievements);
    }

    return new Promise(resolve => {
      this.http.get("assets/data/achievements.json").subscribe(res => {
        this.achievements = [];

        let json = res.json();
        this.achievements = json.map(data => {
          return AchievementFactory.createAchievement(data);
        });

        resolve(this.achievements);
      });
    });
  }
}
