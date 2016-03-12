import {Page, NavController, Alert} from "ionic-angular";
import {DynamicComponentLoader, ElementRef} from "angular2/core";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";

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

  constructor(
      public nav: NavController,
      public dcl: DynamicComponentLoader,
      public elementRef: ElementRef,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypeService: GameTypeService,
      public ads: AdService
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
        this.openLevel();
      });
    });
  }

  openLevelStats() {
    return new Promise(resolve => {
      // TODO: Ensure that alert can"t be closed manually (clicking on the background)
      let alert = Alert.create({
        title: "+ " + this.gameplay.getLevelPoints() + " points",
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

      component.questionFinished.subscribe(() => {
        this.isLocked = true;
        this.openLevelStats().then(() => {
          componentRef.dispose();
          this.gameplay.levelPassed(this.isPerfect);
          this.openLevel();
          this.isLocked = false;
        });
      });

      component.answerValid.subscribe(() => {
        this.playSound("sfx/choice_valid.mp3");
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

    this.nav.push(ScoreSubmitPage);
  }

  playSound(src: string) {
    if (window.Media) {
      let sfx = new window.Media(src);
      sfx.play();
    }
  }
}
