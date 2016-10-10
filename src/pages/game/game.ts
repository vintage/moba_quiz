import {Component} from "@angular/core";
import {NavController, ViewController, AlertController} from "ionic-angular";
import {ComponentFactoryResolver, Compiler, ViewChild, ViewContainerRef} from "@angular/core";
import {Vibration} from "ionic-native";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";
import {AchievementService} from "../../providers/achievement/service";
import {SettingsService} from "../../providers/settings/service";
import {ShopService} from "../../providers/shop/service";
import {GameTypeService} from "../../providers/game-type/service";
import {GameTypeModel} from "../../providers/game-type/model";
import {PointsPipe} from "../../pipes/points";

import {ScoreSubmitPage} from "../score-submit/score-submit";

@Component({
  selector: 'page-game',
  templateUrl: "game.html",
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
  @ViewChild("gameType", {read: ViewContainerRef}) typeContainer: ViewContainerRef;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      private componentFactoryResolver: ComponentFactoryResolver,
      private compiler: Compiler,
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

    Promise.all([itemService.load(), championService.load()]).then(() => {
      this.gameTypes.load();
      this.gameplay.start();
      this.achievements.update("gameplay_small_play_count");
      this.achievements.update("gameplay_medium_play_count");
      this.achievements.update("gameplay_big_play_count");
      this.openLevel();

      settings.isPremium().then(isPremium => {
        if (!isPremium) {
          gameplay.getTimesPlayed().then((timesPlayed) => {
            if (timesPlayed % 2 === 0) {
              this.showAd = true;
              this.ads.prepareFullScreen();
            }
          });
        } else {
          this.gameplay.chances += 1;
          this.skipLeft += 3;
        }
      });

      shop.getItemAmount("extra_life").then(lifeCount => {
        this.gameplay.chances += lifeCount;
      });
      
      shop.getItemAmount("skip_questions").then(skipCount => {
        this.skipLeft += skipCount;
      });
    });
  }

  openLevelStats() {
    return new Promise(resolve => {
      let points: string = new PointsPipe().transform(this.gameplay.getLevelPoints());

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
    return this.gameplay.level !== 0 && this.gameplay.level % 8 === 0;
  }

  getGameType() {
    return this.gameTypes.getAny();
  }

  openLevel() {
    this.isPerfect = true;
    this.gameType = this.getGameType();

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.gameType.component);
    this.gameComponent = this.typeContainer.createComponent(factory);
    
    let component = this.gameComponent.instance;
    component.initializeGame();

    component.questionFinished.subscribe(() => {
      this.isLocked = true;

      this.playSound("sfx/next_level.wav");
      
      if (this.isCoinLevel()) {
        this.shop.addCoins(10);
      }

      this.openLevelStats().then(() => {
        this.gameComponent.destroy();
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
      this.shop.decreaseItemAmount("extra_life");

      if (this.gameplay.isOver()) {
        this.finishGame();
      }
    });
  }

  skipLevel() {
    if (this.skipLeft <= 0) {
      return;
    }

    this.skipLeft -= 1;
    this.shop.decreaseItemAmount("skip_questions");

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
