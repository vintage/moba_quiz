import {Component} from "@angular/core";
import {NavController, ViewController, AlertController} from "ionic-angular";
import {DynamicComponentLoader, ViewChild, ViewContainerRef} from "@angular/core";
import {Vibration} from "ionic-native";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";
import {AchievementService} from "../../providers/achievement/service";
import {SettingsService} from "../../providers/settings/service";
import {ShopService} from "../../providers/shop/service";
import {PointsPipe} from "../../pipes/numbers";

import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";
import {ScoreSubmitPage} from "../score_submit/page";

@Component({
  templateUrl: "build/pages/game/page.html",
  directives: [Stats],
  providers: [GameTypeService],
  inputs: ["question"]
})
export class GamePage {
  gameType: GameTypeModel;

  showAd: boolean;
  isPerfect: boolean;
  isLocked: boolean;
  skipLeft: number;
  gameComponent: any;
  @ViewChild("gameType", {read: ViewContainerRef}) typeContainer;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      public dcl: DynamicComponentLoader,
      private alertCtrl: AlertController,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypes: GameTypeService,
      public ads: AdService,
      private settings: SettingsService,
      public achievements: AchievementService,
      private shop: ShopService
  ) {
    this.isLocked = false;
    this.showAd = false;
    this.skipLeft = 0;

    settings.isPremium().then(isPremium => {
      if (!isPremium) {
        gameplay.getTimesPlayed().then((timesPlayed) => {
          if (timesPlayed % 2 === 0) {
            this.showAd = true;
            this.ads.prepareFullScreen();
          }
        });
      } else {
        this.skipLeft = 3;
      }
    });

    Promise.all([itemService.load(), championService.load()]).then(() => {
      this.gameTypes.load();
      this.gameplay.start();
      this.achievements.update("gameplay_small_play_count");
      this.achievements.update("gameplay_medium_play_count");
      this.achievements.update("gameplay_big_play_count");
      this.openLevel();

      settings.isPremium().then(isPremium => {
        if (isPremium) {
          this.gameplay.addChance();
        }
      });
    });
  }

  openLevelStats() {
    return new Promise(resolve => {
      let points: string = new PointsPipe().transform(this.gameplay.getLevelPoints(), []);

      let title = `
        <div class="alert-line">
          <div class='icon point'></div>
      ` + points + " points </div>";
      if (this.isCoinLevel()) {
        title += `
          <div class="alert-line">
            <div class="icon coin"></div> 10 coins
          </div>
        `;
      }

      let alert = this.alertCtrl.create({
        title: title,
        enableBackdropDismiss: false,
        cssClass: "game-alert"
      });

      alert.present();

      setTimeout(() => {
        alert.dismiss(null).then(() => {
          resolve(true);
        });
      }, 500);
    });
  }

  isCoinLevel(): boolean {
    return this.gameplay.level !== 0 && this.gameplay.level % 10 === 0;
  }

  getGameType() {
    return this.gameTypes.getAny();
  }

  openLevel() {
    this.isPerfect = true;
    this.gameType = this.getGameType();
    this.dcl.loadNextToLocation(this.gameType.component, this.typeContainer).then((componentRef) => {
      this.gameComponent = componentRef;

      let component = componentRef.instance;

      component.questionFinished.subscribe(() => {
        this.isLocked = true;

        this.playSound("sfx/next_level.wav");
        
        if (this.isCoinLevel()) {
          this.shop.addCoins(10);
        }

        this.openLevelStats().then(() => {
          componentRef.destroy();
          this.gameplay.levelPassed(this.isPerfect);

          let strike = this.gameplay.strike;
          if (strike > 0) {
            this.achievements.update("gameplay_small_strike", strike);
            this.achievements.update("gameplay_medium_strike", strike);
            this.achievements.update("gameplay_big_strike", strike);
          }

          this.openLevel();
          this.isLocked = false;
        });
      });

      component.answerValid.subscribe(() => {
        this.playSound("sfx/choice_valid.wav");
      });

      component.answerInvalid.subscribe(() => {
        if (this.isLocked) {
          return;
        }

        this.playSound("sfx/choice_invalid.wav");

        this.settings.isVibrationEnabled().then(isEnabled => {
          if (isEnabled) {
            Vibration.vibrate(100);
          }
        });

        this.isPerfect = false;
        this.gameplay.invalidMove();

        if (this.gameplay.isOver()) {
          this.finishGame();
        }
      });
    });
  }

  skipLevel() {
    if (this.skipLeft <= 0) {
      return;
    }

    this.skipLeft -= 1;

    this.gameComponent.destroy();
    this.gameplay.levelNext();
    this.openLevel();
    this.isLocked = false;
  }

  onTimeOver() {
    this.finishGame();
  }

  finishGame() {
    this.isLocked = true;

    let alert = this.alertCtrl.create({
      title: "Game Over",
      enableBackdropDismiss: false,
      cssClass: "game-alert"
    });

    alert.present();

    setTimeout(() => {
      alert.dismiss(null).then(() => {
        this.nav.push(ScoreSubmitPage).then(() => {
          this.nav.remove(this.nav.indexOf(this.viewCtrl)).then(() => {
            if (this.showAd) {
              this.ads.showFullScreen();
            }
          });
        });
      });
    }, 1000);
  }

  playSound(src: string) {
    // if (window.Media) {
    //   let sfx = new window.Media(src);
    //   sfx.play();
    // }
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Game");
    }
  }
}
