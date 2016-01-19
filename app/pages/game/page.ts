import {Page, NavController} from 'ionic-framework/ionic';
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

    itemService.load().then(() => {
      championService.load().then(() => {
        this.gameplay.start();
        this.openLevel();
      });
    });
  }

  openLevel() {
    this.isPerfect = true;
    this.gameType = this.gameTypeService.getAny();
    this.dcl.loadIntoLocation(this.gameType.component, this.elementRef, 'child').then((componentRef) => {
      let component = componentRef.instance;

      component.questionFinished.subscribe(() => {
        componentRef.dispose();
        this.gameplay.levelPassed(this.isPerfect);
        this.openLevel();
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
