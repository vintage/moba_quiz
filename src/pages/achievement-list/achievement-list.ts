import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import {AchievementService} from "../../providers/achievement/service";
import {AbstractAchievementModel} from "../../providers/achievement/model";

@Component({
  selector: 'page-achievement-list',
  templateUrl: "achievement-list.html"
})
export class AchievementListPage {
  achievements: AbstractAchievementModel[];

  constructor(public nav: NavController, public achievementService: AchievementService) {
    achievementService.loadExtended().then(achievements => {
      this.achievements = achievements;
    });
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Achievement List");
    }
  }
}
