import {Page, NavController, Alert, ViewController} from "ionic-angular";
import {DynamicComponentLoader, ElementRef} from "angular2/core";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";
import {AchievementService} from "../../providers/achievement/service";
import {PointsPipe} from "../../pipes/numbers";

import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";
import {ScoreSubmitPage} from "../score_submit/page";

@Page({
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
  backgroundImage: string = "img/background.jpg";

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      public dcl: DynamicComponentLoader,
      public elementRef: ElementRef,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypeService: GameTypeService,
      public ads: AdService,
      public achievements: AchievementService
  ) {
    this.isLocked = false;
    this.showAd = false;

    gameplay.getTimesPlayed().then((timesPlayed) => {
      if (timesPlayed === 3 || timesPlayed % 10 === 0) {
        this.showAd = true;
        this.ads.prepareFullScreen();
      }
    });

    itemService.load().then(() => {
      championService.load().then(() => {
        this.gameplay.start();
        this.achievements.update("gameplay_small_play_count");
        this.achievements.update("gameplay_medium_play_count");
        this.achievements.update("gameplay_big_play_count");
        this.openLevel();
      });
    });
  }

  setBackground(background: string) {
    this.backgroundImage = background;
  }

  resetBackground() {
    this.backgroundImage = "img/background.jpg";
  }

  openLevelStats() {
    return new Promise(resolve => {
      let points: string = new PointsPipe().transform(this.gameplay.getLevelPoints(), []);

      let alert = Alert.create({
        title: "+ " + points + " points",
        enableBackdropDismiss: false
      });

      this.nav.present(alert);

      setTimeout(() => {
        alert.dismiss(null);
        resolve(true);
      }, 1000);
    });
  }

  openLevel() {
    this.isPerfect = true;
    this.gameType = this.gameTypeService.getAny();
    this.dcl.loadIntoLocation(this.gameType.component, this.elementRef, "child").then((componentRef) => {
      let component = componentRef.instance;
      componentRef.location.nativeElement.className += "game-container";

      component.questionFinished.subscribe(() => {
        this.isLocked = true;

        this.playSound("sfx/next_level.wav");
        this.openLevelStats().then(() => {
          componentRef.dispose();
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

      this.resetBackground();
      component.setBackground.subscribe((background) => {
        this.setBackground(background);
      });

      component.answerValid.subscribe(() => {
        this.playSound("sfx/choice_valid.wav");
      });

      component.answerInvalid.subscribe(() => {
        this.playSound("sfx/choice_invalid.wav");

        if (window.navigator.vibrate) {
          window.navigator.vibrate(1000);
        }

        this.isPerfect = false;
        this.gameplay.invalidMove();

        if (this.gameplay.isOver()) {
          this.finishGame();
        }
      });
    });
  }

  onTimeOver() {
    this.finishGame();
  }

  finishGame() {
    if (this.showAd) {
      this.ads.showFullScreen();
    }

    this.nav.push(ScoreSubmitPage).then(() => {
      this.nav.remove(this.viewCtrl.index);
    });
  }

  playSound(src: string) {
    if (window.Media) {
      let sfx = new window.Media(src);
      sfx.play();
    }
  }
}
