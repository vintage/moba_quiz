import {OnInit} from "angular2/core";
import {Button, Page, NavController, Platform, Alert} from "ionic-angular";

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";
import {AchievementService} from "../../providers/achievement/service";
import {PointsPipe} from "../../pipes/numbers";

import {GamePage} from "../game/page";
import {HighscorePage} from "../highscore/page";
import {AchievementListPage} from "../achievement_list/page";
import {AboutPage} from "../about/page";

@Page({
  templateUrl: "build/pages/main_menu/page.html",
  directives: [Button],
  pipes: [PointsPipe]
})
export class MainMenuPage {
  timesPlayed: number;
  bestScore: number;

  constructor(
    public nav: NavController,
    public gameplay: GameplayService,
    public scoreService: ScoreService,
    public achievements: AchievementService,
    public platform: Platform) {
  }

  ngOnInit() {
    this.gameplay.getTimesPlayed().then(timesPlayed => {
      this.timesPlayed = timesPlayed;
    });

    this.scoreService.getBestScore().then(bestScore => {
      this.bestScore = bestScore;
    });
  }

  openGame() {
    this.nav.push(GamePage);
  }

  openHighscore() {
    this.nav.push(HighscorePage);
  }

  openAchievements() {
    this.nav.push(AchievementListPage);
  }

  openAbout() {
    this.nav.push(AboutPage);
  }

  openRating() {
    let marketUrl = null;

    if (this.platform.is("ios")) {
      marketUrl = "itms-apps://itunes.apple.com/app/idYOUR_APP_ID";
    }
    else if (this.platform.is("android")) {
      marketUrl = "market://details?id=com.YOUR.PACKAGENAME";
    }
    else {
      marketUrl = "https://www.microsoft.com/pl-pl/store/games/lol-quiz-free/9wzdncrfhvz4";
    }

    if (window.cordova) {
      window.cordova.InAppBrowser.open(marketUrl, "_system", "location=no");
    }
    else {
      window.open(marketUrl, "_blank");
    }

    this.achievements.update("rate_app");
  }
}
