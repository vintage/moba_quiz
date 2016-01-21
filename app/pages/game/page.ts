import {Page, NavController, Alert} from 'ionic-framework/ionic';
import {DynamicComponentLoader, ElementRef} from 'angular2/core';

import {ItemService} from "../../providers/item/service";
import {ChampionService} from '../../providers/champion/service';
import {GameplayService} from "../../providers/gameplay/service";

import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";
import {ScoreSubmitPage} from "../score_submit/page";

@Page({
  templateUrl: 'build/pages/game/page.html',
  directives: [Stats],
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
      let alert = Alert.create({
        title: '+' + this.gameplay.getLevelPoints() + ' points'
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
    this.dcl.loadIntoLocation(this.gameType.component, this.elementRef, 'child').then((componentRef) => {
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

      component.answerInvalid.subscribe(() => {
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
    //let currentView = this.nav.last();
    //
    //this.nav.remove(currentView.index);
    this.nav.push(ScoreSubmitPage);
  }
}
