import {OnInit} from "angular2/core";
import {Button, Page, NavController, Platform, Alert} from "ionic-angular";

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
      marketUrl = "https://www.microsoft.com/pl-pl/store/games/lol-quiz-free/9wzdncrfhvz4";
    }

    if (window.cordova) {
      window.cordova.InAppBrowser.open(marketUrl, "_system", "location=no");
    }
    else {
      window.open(marketUrl, "_blank");
    }
  }

  showContactAlert() {
    let alert = Alert.create({
      title: "Missing email client",
      message: "Contact us at puppy.box@outlook.com!"
    });

    this.nav.present(alert);
  }

  openContact() {
    if (window.cordova) {
      window.cordova.plugins.email.isAvailable(function(isAvailable) {
        if (isAvailable) {
          window.cordova.plugins.email.open({
            to: "puppy.box@outlook.com",
            subject: "Contact form"
          });
        } else {
          this.showContactAlert();
        }
      });
    }
    else {
      this.showContactAlert();
    }
  }
}
