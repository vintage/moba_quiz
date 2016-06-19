import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {filter} from "lodash";

import {AchievementService} from "../../providers/achievement/service";
import {AbstractAchievementModel} from "../../providers/achievement/model";

@Component({
  templateUrl: "build/pages/achievement_list/page.html"
})
export class AchievementListPage {
  achievements: AbstractAchievementModel[];

  constructor(public nav: NavController, public achievementService: AchievementService) {
    achievementService.loadExtended().then(achievements => {
      this.achievements = achievements;
    });
  }
}
