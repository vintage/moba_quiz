import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {DynamicComponentLoader, ElementRef} from 'angular2/core';

import {ItemService} from "../../providers/item/service";
import {ChampionService} from '../../providers/champion/service';
import {GameplayService} from "../../providers/gameplay/service";

import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";
import {ScoreSubmitPage} from "../score_submit/page";
import {AdsBar} from "../../components/ads_bar/component";

@Page({
  templateUrl: 'build/pages/game/page.html',
  directives: [Stats, AdsBar],
  providers: [GameTypeService],
  inputs: ['question']
})
export class GamePage {
  public gameType: GameTypeModel;
  public isPerfect:boolean;
  public isLocked:boolean;

  constructor(
      nav: NavController,
      dcl: DynamicComponentLoader,
      elementRef: ElementRef,
      gameplayService: GameplayService,
      itemService: ItemService,
      championService: ChampionService,
      gameTypeService: GameTypeService
  ) {
    this.nav = nav;
    this.dcl = dcl;
    this.elementRef = elementRef;

    this.gameplay = gameplayService;
    this.gameTypeService = gameTypeService;

    this.isLocked = false;

    itemService.load().then(() => {
      championService.load().then(() => {
        this.gameplay.start();
        this.openLevel();
      });
    });
  }

  openLevelStats() {
    return new Promise(resolve => {
      // TODO: Ensure that alert can't be closed manually (clicking on the background)
      let alert = Alert.create({
        title: '+' + this.gameplay.getLevelPoints() + ' points'
      });

      // Workaround for disabling alert dismissing
      let alertDismiss = alert.dismiss;
      alert.dismiss = function() {};
      this.nav.present(alert);

      setTimeout(() => {
        alert.dismiss = alertDismiss;
        alert.dismiss(null);
        resolve(true);
      }, 1000);
    });
  }

  openLevel() {
    this.isPerfect = true;
    this.gameType = this.gameTypeService.getAny();
    this.dcl.loadIntoLocation(this.gameType.component, this.elementRef, 'child').then((componentRef) => {
      componentRef.location.nativeElement.className += this.gameType.name;
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
        this.playSound('sfx/choice_valid.mp3');
      });

      component.answerInvalid.subscribe(() => {
        this.playSound('sfx/choice_invalid.wav');
        navigator.vibrate(1000);
        this.isPerfect = false;
        this.gameplay.invalidMove();

        if(this.gameplay.isOver()) {
          this.finishGame();
        }
      });
    });
  }

  onTimeOver() {
    this.finishGame();
  }

  finishGame() {
    this.nav.push(ScoreSubmitPage);
  }

  playSound(src:string) {
    if(window.cordova) {
      let sfx = new Media(src);
      sfx.play();
    }
  }
}
