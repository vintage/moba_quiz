import {Component, ComponentRef} from "@angular/core";
import {NavController, ViewController, AlertController} from "ionic-angular";
import {ComponentFactoryResolver, Compiler, ViewChild, ViewContainerRef} from "@angular/core";
import {Vibration} from "ionic-native";
import {TranslateService} from 'ng2-translate/ng2-translate';
import _ from "lodash";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";
import {AchievementService} from "../../providers/achievement/service";
import {SettingsService} from "../../providers/settings/service";
import {ShopService} from "../../providers/shop/service";
import {GameTypeService} from "../../providers/game-type/service";
import {GameTypeModel} from "../../providers/game-type/model";
import {MusicService} from "../../providers/music/service";
import {PointsPipe} from "../../pipes/points";

import {ScoreSubmitPage} from "../score-submit/score-submit";

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {
  showAd: boolean;
  isPerfect: boolean;
  isLocked: boolean;
  skipLeft: number;
  gameComponents: ComponentRef<any>[];
  @ViewChild("gameType", {read: ViewContainerRef}) currentLevel: ViewContainerRef;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      public componentFactoryResolver: ComponentFactoryResolver,
      public compiler: Compiler,
      public alertCtrl: AlertController,
      public translate: TranslateService,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypes: GameTypeService,
      public ads: AdService,
      public settings: SettingsService,
      public achievements: AchievementService,
      public shop: ShopService,
      public music: MusicService
  ) {
    this.isLocked = false;
    this.showAd = false;
    this.skipLeft = 0;
    this.gameComponents = [];
  }

  startGame() {
    this.gameTypes.load();
    this.gameplay.start();
    this.achievements.update("gameplay_small_play_count");
    this.achievements.update("gameplay_medium_play_count");
    this.achievements.update("gameplay_big_play_count");
    this.openLevel();

    this.settings.isPremium().then(isPremium => {
      if (!isPremium) {
        this.gameplay.getTimesPlayed().then((timesPlayed) => {
          if (timesPlayed % 2 === 0) {
            this.showAd = true;
            this.ads.prepareFullScreen();
          }
        });
      } else {
        this.addExtraLife(1);
        this.addExtraSkips(3);
      }
    });

    this.shop.getItemAmount("extra_life").then(lifeCount => {
      this.addExtraLife(lifeCount);
    });
    
    this.shop.getItemAmount("skip_questions").then(skipCount => {
      this.addExtraSkips(skipCount);
    });
  }

  addExtraLife(count: number) {
    this.gameplay.chances += count;
  }

  removeExtraLife() {
    this.shop.decreaseItemAmount("extra_life");
  }

  addExtraSkips(count: number) {
    this.skipLeft += count;
  }

  openLevelStats() {
    return new Promise(resolve => {
      let points: string = new PointsPipe().transform(this.gameplay.getLevelPoints());

      let title = `
        <div class="alert-line">
          <div class='icon point'></div>
      ` + points + " </div>";
      if (this.isCoinLevel()) {
        title += `
          <div class="alert-line">
            <div class="icon coin"></div> ` + this.getCoinsAmount() + `
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
      }, 800);
    });
  }

  isCoinLevel(): boolean {
    return this.gameplay.level !== 0 && this.gameplay.level % 3 === 0;
  }

  getCoinsAmount(): number {
    return _.random(4, 8);
  }

  getGameType() {
    return this.gameTypes.getAny();
  }

  activateGameComponent(component: any) {
    component.initializeGame();

    component.questionFinished.subscribe(() => {
      this.isLocked = true;

      this.music.play("nextLevel");
      
      if (this.isCoinLevel()) {
        this.shop.addCoins(this.getCoinsAmount());
      }

      this.openLevelStats().then(() => {
        this.destroyLevel();
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
      this.music.play("choiceValid");
    });

    component.answerInvalid.subscribe(() => {
      if (this.isLocked) {
        return;
      }

      this.music.play("choiceInvalid");

      this.settings.isVibrationEnabled().then(isEnabled => {
        if (isEnabled) {
          Vibration.vibrate(100);
        }
      });

      this.isPerfect = false;
      this.gameplay.invalidMove();
      this.removeExtraLife();

      if (this.gameplay.isOver()) {
        this.finishGame();
        component.gameOver();
      }
    });
  }

  createGameComponent(gameType: GameTypeModel, container: ViewContainerRef): ComponentRef<any> {
    let factory = this.componentFactoryResolver.resolveComponentFactory(gameType.component);

    let gameComponent = container.createComponent(factory);

    this.activateGameComponent(gameComponent.instance);
    return gameComponent;
  }

  openLevel() {
    this.isPerfect = true;

    while (this.currentLevel.length < 2) {
      let game = this.createGameComponent(this.getGameType(), this.currentLevel);
      game.location.nativeElement.hidden = true;

      this.gameComponents.push(game);
    }

    this.gameComponents[0].location.nativeElement.hidden = false;
  }

  destroyLevel() {
    this.currentLevel.remove(0);
    this.gameComponents.shift();
  }

  skipLevel() {
    if (this.skipLeft <= 0) {
      return;
    }

    this.music.play('skip');

    this.skipLeft -= 1;
    this.shop.decreaseItemAmount("skip_questions");

    this.destroyLevel();
    this.gameplay.levelNext();
    this.openLevel();
    this.isLocked = false;
  }

  onTimeOver() {
    this.finishGame();
  }

  finishGame() {
    this.isLocked = true;
    
    let alertDismissed = false;

    let alert = this.alertCtrl.create({
      title: this.translate.instant("Game over"),
      message: this.translate.instant('Valid answers has been shown on the screen'),
      enableBackdropDismiss: true,
      cssClass: "game-alert"
    });
    alert.willLeave.subscribe(() => {
      alertDismissed = true;
      this.openScoreSubmit()
    });

    alert.present().then(() => {
      // Close the popup after 5 seconds automatically
      setTimeout(() => {
        if (!alertDismissed) {
          alert.dismiss();
        }
      }, 5000);
    });
  }

  openScoreSubmit() {
    this.nav.push(ScoreSubmitPage).then(() => {
      this.nav.remove(this.nav.indexOf(this.viewCtrl)).then(() => {
        if (this.showAd) {
          this.ads.showFullScreen();
        }
      });
    });
  }

  ionViewWillEnter() {
    Promise.all([this.itemService.load(), this.championService.load()]).then(() => {
      this.startGame();
    });
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Game");
    }
  }
}
