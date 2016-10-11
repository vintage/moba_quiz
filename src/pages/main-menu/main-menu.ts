import {Component} from "@angular/core";
import {NavController, Platform, AlertController} from "ionic-angular";

import {GameplayService} from "../../providers/gameplay/service";
import {ScoreService} from "../../providers/score/service";
import {AchievementService} from "../../providers/achievement/service";
import {ShopService} from "../../providers/shop/service";

import {GamePage} from "../game/game";
import {GameHardcorePage} from "../game-hardcore/game-hardcore";
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
    private alertCtrl: AlertController,
    public gameplay: GameplayService,
    public scoreService: ScoreService,
    public achievements: AchievementService,
    private shop: ShopService,
    public platform: Platform) {
  }

  openGame() {
    this.nav.push(GamePage);
  }

  openGameHardcore() {
    this.shop.getItemAmount("hardcore_ticket").then(tickets => {
      if (tickets > 0) {
        this.shop.decreaseItemAmount("hardcore_ticket");
        this.nav.push(GameHardcorePage);
      } else {
        this.missingHardcoreTicket();
      }
    });
  }

  missingHardcoreTicket() {
    let alert = this.alertCtrl.create({
      title: "Ticket required",
      message: "You have to buy the Hardcore Ticket in order to play this mode.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Open shop',
          handler: () => {
            this.openShop();
          }
        }
      ]
    });

    alert.present();
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

  ionViewWillEnter() {
    this.gameplay.getTimesPlayed().then(timesPlayed => {
      this.timesPlayed = timesPlayed;
    });

    this.scoreService.getBestScore().then(bestScore => {
      this.bestScore = bestScore;
    });
  }
}
