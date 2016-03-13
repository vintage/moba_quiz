import {OnInit} from "angular2/core";
import {Button, Page, NavController, Alert} from "ionic-angular";

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
  score: number;

  constructor(
      public nav: NavController,
      public gameplay: GameplayService,
      public countryService: CountryService,
      public scoreService: ScoreService) {
    this.isPending = false;
    this.isSubmitted = false;
    this.score = gameplay.points;
  }

  ngOnInit() {
    this.scoreService.getBestScore().then(bestScore => {
      if (this.score > bestScore) {
        this.scoreService.setBestScore(this.score);
      }
    });

    this.gameplay.getPlayerName().then(playerName => {
      this.playerName = playerName;
    });
  }

  onPageWillEnter() {
    this.countryService.load().then(() => {
      this.countryService.getCurrent().then(country => {
        this.country = country;
      });
    });
  }

  showCountryList() {
    this.nav.push(CountryListPage);
  }

  playAgain() {
    this.nav.push(GamePage);
  }

  openMenu() {
    this.nav.push(MainMenuPage);
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
    this.scoreService.create(this.playerName, this.score, countryID).then((is_success) => {
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
}
