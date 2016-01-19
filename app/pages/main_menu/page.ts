import {OnInit} from 'angular2/core';
import {Button, Page, NavController, Platform} from 'ionic-framework/ionic';

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";

import {GamePage} from "../game/page";
import {HighscorePage} from "../highscore/page";

@Page({
  templateUrl: 'build/pages/main_menu/page.html',
  directives: [Button]
})
export class MainMenuPage {
  public timesPlayed: number;
  public bestScore: number;

  constructor(nav: NavController, gameplayService: GameplayService, scoreService: ScoreService, platform: Platform) {
    this.nav = nav;
    this.platform = platform;
    this.gameplay = gameplayService;
    this.scoreService = scoreService;
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
    this.platform.ready().then(() => {
      var marketUrl = null;

      console.log(this.platform);

      if (this.platform.is('ios')) {
        marketUrl = 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID';
      }
      else if (this.platform.is('android')) {
        marketUrl = 'market://details?id=com.YOUR.PACKAGENAME';
      }
      else if (this.platform.is('windowsphone')) {
        marketUrl = 'http://windowsphone.com/s?appId=c14e93aa-27d7-df11-a844-00237de2db9e';
      }

      if (marketUrl) {
        window.open(marketUrl);
      }
    });
  }

  openContact() {
    this.platform.ready().then(() => {
      cordova.plugins.email.isAvailable(function(isAvailable) {
        if (isAvailable) {
          cordova.plugins.email.open();
        }
      });
    });
  }
}
