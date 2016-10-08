import {Component} from "@angular/core";
import {Button, NavController, Platform} from "ionic-angular";

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";
import {AchievementService} from "../../providers/achievement/service";
import {PointsPipe} from "../../pipes/numbers";

import {GamePage} from "../game/page";
import {HighscorePage} from "../highscore/page";
import {AchievementListPage} from "../achievement_list/page";
import {SettingsPage} from "../settings/page";
import {TutorialPage} from "../tutorial/page";
import {ShopPage} from "../shop/page";

@Component({
  templateUrl: "build/pages/main_menu/page.html",
  directives: [Button],
  pipes: [PointsPipe]
})
export class MainMenuPage {
  timesPlayed: number;
  bestScore: number;
  hasPremium: boolean;

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

  openSettings() {
    this.nav.push(SettingsPage);
  }

  openTutorial() {
    this.nav.push(TutorialPage);
  }

  openShop() {
    this.nav.push(ShopPage);
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Main Menu");
    }
  }
}
