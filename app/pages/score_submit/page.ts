import {OnInit} from "@angular/core";
import {Button, Page, NavController, Alert, ViewController, Platform} from "ionic-angular";
import {Globalization} from "ionic-native";

import {GameplayService} from "../../providers/gameplay/service";
import {CountryService} from "../../providers/country/service";
import {CountryModel} from "../../providers/country/model";
import {ScoreService} from "../../providers/score/service";
import {PointsPipe} from "../../pipes/numbers";

import {CountryListPage} from "../country_list/page";
import {GamePage} from "../game/page";
import {MainMenuPage} from "../main_menu/page";

@Page({
  templateUrl: "build/pages/score_submit/page.html",
  directives: [Button],
  pipes: [PointsPipe]
})
export class ScoreSubmitPage implements OnInit {
  country: CountryModel;
  playerName: string;
  isPending: boolean;
  isSubmitted: boolean;
  isNewHighscore: boolean;
  score: number;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      public platform: Platform,
      public gameplay: GameplayService,
      public countries: CountryService,
      public scoreService: ScoreService) {
    this.isPending = false;
    this.isSubmitted = false;
    this.isNewHighscore = false;
    this.score = gameplay.points;
  }

  ngOnInit() {
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

  onPageWillEnter() {
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

  is_valid() {
    let valid = true;
    let message = "";

    if (!this.playerName) {
      valid = false;
      message = "You need to enter your player name to submit the score.";
    }
    else if (this.playerName.length > 16) {
      valid = false;
      message = "Player name can be 16 characters only.";
    }
    else if (!/^[a-zA-Z0-9]+$/.test(this.playerName)) {
      valid = false;
      message = "Player name can contain only letters and digits. No special characters are allowed.";
    }

    if (window.navigator.connection && window.navigator.connection.type === window.Connection.NONE) {
      valid = false;
      message = "Can't submit the score. Check your internet connection.";
    }

    if (!valid) {
      let alert = Alert.create({
        title: message,
        buttons: ["OK"]
      });
      this.nav.present(alert);
    }

    return valid;
  }

  submitScore() {
    if (!this.is_valid()) {
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
    }
    else if (this.platform.is("android")) {
      platform = "android";
    }
    else {
      platform = "windows";
    }

    this.scoreService.create(this.playerName, this.score, countryID, platform).then((is_success) => {
      this.isPending = false;

      if (is_success) {
        this.isSubmitted = true;
      }
      else {
        let alert = Alert.create({
          title: "Score hasn't been saved",
          subTitle: "Check your internet connection and try again.",
          buttons: ["OK"]
        });
        this.nav.present(alert);
      }
    }).catch(() => {
      let alert = Alert.create({
        title: "Score hasn't been saved",
        subTitle: "Check your internet connection and try again.",
        buttons: ["OK"]
      });
      this.nav.present(alert);
    });
  }

  playSound(src: string) {
    // if (window.Media) {
    //   let sfx = new window.Media(src);
    //   sfx.play();
    // }
  }

  setDefaultCountry() {
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
}
