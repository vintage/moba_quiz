import {OnInit} from "angular2/core";
import {Button, Page, NavController, Platform} from "ionic-angular";

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";

import {GamePage} from "../game/page";
import {HighscorePage} from "../highscore/page";

@Page({
  templateUrl: "build/pages/main_menu/page.html",
  directives: [Button]
})
export class MainMenuPage {
  timesPlayed: number;
  bestScore: number;

  constructor(public nav: NavController, public gameplay: GameplayService, public scoreService: ScoreService, public platform: Platform) {
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

  openRating() {
    let marketUrl = null;

    if (this.platform.is("ios")) {
      marketUrl = "itms-apps://itunes.apple.com/app/idYOUR_APP_ID";
    }
    else if (this.platform.is("android")) {
      marketUrl = "market://details?id=com.YOUR.PACKAGENAME";
    }
    else {
      marketUrl = "http://windowsphone.com/s?appId=c14e93aa-27d7-df11-a844-00237de2db9e";
    }

    window.cordova.InAppBrowser.open(marketUrl, "_system", "location=no");
  }

  openContact() {
    if(window.cordova) {
      cordova.plugins.email.isAvailable(function(isAvailable) {
        if (isAvailable) {
          cordova.plugins.email.open();
        }
      });
    }
  }
}
