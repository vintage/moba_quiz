import {Component} from "@angular/core";
import {NavController, Platform, AlertController} from "ionic-angular";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {InAppBrowser} from "ionic-native";

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
  isShopAvailable: boolean;

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    public gameplay: GameplayService,
    public scoreService: ScoreService,
    public achievements: AchievementService,
    private shop: ShopService,
    public platform: Platform,
    private translate: TranslateService) {
  }

  openGame() {
    this.nav.push(GamePage);
  }

  openGameHardcore() {
    if (this.isShopAvailable) {
      this.shop.getItemAmount("hardcore_ticket").then(tickets => {
        if (tickets > 0) {
          this.shop.decreaseItemAmount("hardcore_ticket");
          this.nav.push(GameHardcorePage);
        } else {
          this.missingHardcoreTicket();
        }
      });
    } else {
      this.nav.push(GameHardcorePage);
    }
  }

  missingHardcoreTicket() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('Ticket required'),
      message: this.translate.instant('You have to buy the Hardcore Ticket in order to play this mode') + '.',
      buttons: [
        {
          text: this.translate.instant('Cancel'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('Open shop'),
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

  openPersonalAd() {
    let url: string = null;
    if (this.platform.is('ios')) {
      url = 'itms-apps://itunes.apple.com/app/id1227277525';
    } else {
      url = 'market://details?id=pl.puppybox.vaultomb';
    }

    new InAppBrowser(url, '_system');
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Main Menu");
    }
  }

  ionViewWillEnter() {
    this.isShopAvailable = !this.platform.is('windows');

    this.gameplay.getTimesPlayed().then(timesPlayed => {
      this.timesPlayed = timesPlayed;
    });

    this.scoreService.getBestScore().then(bestScore => {
      this.bestScore = bestScore;
    });
  }
}
