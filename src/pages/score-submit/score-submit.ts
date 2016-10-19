import {Component} from "@angular/core";
import {NavController, NavParams, AlertController, ViewController, Platform} from "ionic-angular";
import {Globalization, InAppBrowser} from "ionic-native";

import {GameplayService} from "../../providers/gameplay/service";
import {CountryService} from "../../providers/country/service";
import {CountryModel} from "../../providers/country/model";
import {ScoreService} from "../../providers/score/service";
import {SettingsService} from "../../providers/settings/service";
import {ShopService} from "../../providers/shop/service";

import {CountryListPage} from "../country-list/country-list";
import {GamePage} from "../game/game";
import {MainMenuPage} from "../main-menu/main-menu";

@Component({
  selector: 'page-score-submit',
  templateUrl: "score-submit.html",
})
export class ScoreSubmitPage {
  country: CountryModel;
  playerName: string;
  isPending: boolean;
  isSubmitted: boolean;
  isNewHighscore: boolean;
  score: number;
  isHardcore: boolean;

  constructor(
      public nav: NavController,
      private params: NavParams,
      public viewCtrl: ViewController,
      public platform: Platform,
      private alertCtrl: AlertController,
      public gameplay: GameplayService,
      public countries: CountryService,
      private settings: SettingsService,
      private shop: ShopService,
      public scoreService: ScoreService) {
    this.isPending = false;
    this.isSubmitted = false;
    this.isNewHighscore = false;
    this.score = gameplay.points;
    this.isHardcore = params.get('isHardcore') || false;
  }

  ionViewWillEnter() {
    this.countries.load().then(() => {
      this.countries.getCurrent().then(country => {
        if (country === null) {
          this.setDefaultCountry();
        }
        else {
          this.country = country;
        }
      });
    });

    this.scoreService.getBestScore().then(bestScore => {
      if (this.score > bestScore) {
        this.isNewHighscore = true;
        this.playSound("sfx/new_best_score.mp3");
        this.scoreService.setBestScore(this.score);
      }
    });

    this.gameplay.getPlayerName().then(playerName => {
      this.playerName = playerName;
    });
  }

  showCountryList() {
    this.nav.push(CountryListPage);
  }

  playAgain() {
    this.nav.push(GamePage).then(() => {
      this.nav.remove(this.nav.indexOf(this.viewCtrl));
    });
  }

  openMenu() {
    this.nav.setRoot(MainMenuPage);
  }

  isValid() {
    let valid = true;
    let message = "";

    if (!this.playerName) {
      valid = false;
      message = "You need to enter your player name to submit the score.";
    } else if (this.playerName.length > 16) {
      valid = false;
      message = "Player name can be 16 characters only.";
    } else if (!/^[a-zA-Z0-9]+$/.test(this.playerName)) {
      valid = false;
      message = "Player name can contain only letters and digits. No special characters are allowed.";
    }

    if (window['navigator']['connection'] && window['navigator']['connection']['type'] === window['Connection']['NONE']) {
      valid = false;
      message = "Can't submit the score. Check your internet connection.";
    }

    if (!valid) {
      let alert = this.alertCtrl.create({
        title: message,
        buttons: ["OK"]
      });
      alert.present();
    }

    return valid;
  }

  submitScore() {
    if (!this.isValid()) {
      return false;
    }

    if (this.isPending) {
      return false;
    }

    this.gameplay.setPlayerName(this.playerName);

    let countryID = "";
    if (this.country) {
      countryID = this.country.id;
    }

    this.isPending = true;

    let platform: string;
    if (this.platform.is("ios")) {
      platform = "apple";
    } else if (this.platform.is("android")) {
      platform = "android";
    } else {
      platform = "windows";
    }

    this.scoreService.create(this.playerName, this.score, countryID, platform, this.isHardcore, {
      "level": this.gameplay.level,
      "max_strike": this.gameplay.maxStrike
    }).then((is_success) => {
      this.isPending = false;

      if (is_success) {
        this.isSubmitted = true;
      } else {
        let alert = this.alertCtrl.create({
          title: "Score hasn't been saved",
          subTitle: "Check your internet connection and try again.",
          buttons: ["OK"]
        });
        alert.present();
      }
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: "Score hasn't been saved",
        subTitle: "Check your internet connection and try again.",
        buttons: ["OK"]
      });
      alert.present();
    });
  }

  playSound(src: string) {
    // if (window.Media) {
    //   let sfx = new window.Media(src);
    //   sfx.play();
    // }
  }

  setDefaultCountry() {
    if (!window['cordova']) {
      return;
    }

    Globalization.getLocaleName().then(locale => {
      let countryCode = locale.value.toUpperCase();
      if (countryCode == null) {
        return;
      }

      // Get only last 2 letters
      if (countryCode.length > 2) {
        countryCode = countryCode.slice(-2);
      }

      let country = this.countries.getById(countryCode);
      if (country !== null) {
        this.country = country;
        this.countries.setCurrent(country);
      }
    });
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Score Submit");
    }
  }

  openRating() {
    let url: string = this.settings.appUrl;

    this.settings.rateApp().then(() => {
      return this.shop.addCoins(5000);
    }).then(() => {
      InAppBrowser.open(url, "_blank");
    });
  }
}
