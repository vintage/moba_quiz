import {Page, NavController} from 'ionic-framework/ionic';
import {DynamicComponentLoader, Component, ElementRef} from 'angular2/core';

import {ItemService} from "../item/service";
import {ChampionService} from '../champion/service';
import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";
import {GameplayService} from "../gameplay/service";

@Page({
  templateUrl: 'build/game/game.html',
  directives: [Stats],
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

    itemService.initialize().add(() => {
      championService.initialize().add(() => {
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
    console.log("KONIEC CZASU");

    this.finishGame();
  }

  finishGame() {
    // Move to score submit view
    console.log("FINISH GAME");
  }
}