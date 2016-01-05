import {Page, NavController} from 'ionic-framework/ionic';
import {DynamicComponentLoader, Component, ElementRef} from 'angular2/core';

import {ItemService} from "../item/service";
import {ChampionService} from '../champion/service';
import {Stats} from "./stats/component";
import {GameTypeService} from "./types/service";
import {GameTypeModel} from "./types/model";

@Page({
  templateUrl: 'build/game/game.html',
  directives: [Stats],
  inputs: ['question']
})
export class GamePage {
  public gameType: GameTypeModel;

  constructor(
      nav: NavController,
      dcl: DynamicComponentLoader,
      elementRef: ElementRef,
      itemService: ItemService,
      championService: ChampionService,
      gameTypeService: GameTypeService
  ) {
    this.nav = nav;
    this.dcl = dcl;
    this.elementRef = elementRef;

    this.gameTypeService = gameTypeService;

    itemService.Initialize().add(() => {
      championService.Initialize().add(() => {
        this.openLevel();
      });
    });
  }

  openLevel() {
    this.gameType = this.gameTypeService.getRandom();
    this.dcl.loadIntoLocation(this.gameType.component, this.elementRef, 'child').then((componentRef) => {
      let component = componentRef.instance;

      component.questionFinished.subscribe(() => {
        componentRef.dispose();
        this.openLevel();
      });

      component.answerInvalid.subscribe(() => {
        console.log("invalid answer");
      });
    });
  }
}