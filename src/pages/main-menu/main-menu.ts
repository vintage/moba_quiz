import {Component} from "@angular/core";
import {NavController, Platform} from "ionic-angular";

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";
import {AchievementService} from "../../providers/achievement/service";

import {GamePage} from "../game/game";
import {HighscorePage} from "../highscore/highscore";
import {AchievementListPage} from "../achievement-list/achievement-list";
import {SettingsPage} from "../settings/settings";
import {TutorialPage} from "../tutorial/tutorial";
import {ShopPage} from "../shop/shop";

@Component({
  selector: 'page-main-menu',
  templateUrl: "main-menu.html",
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
