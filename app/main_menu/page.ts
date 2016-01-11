import {OnInit} from 'angular2/core';
import {Button, Page, NavController} from 'ionic-framework/ionic';

import {GamePage} from "../game/game";
import {GameplayService} from "../gameplay/service";
import {ScoreService} from "../score/service";

@Page({
  templateUrl: 'build/main_menu/page.html',
  directives: [Button]
})
export class MainMenuPage {
  public timesPlayed:number;
  public bestScore:number;

  constructor(nav: NavController, gameplayService: GameplayService, scoreService: ScoreService) {
    this.nav = nav;
    this.gameplay = gameplayService;
    this.scoreService = scoreService;
  }

  ngOnInit() {
    this.gameplay.getTimesPlayed().then(timesPlayed => {
      this.timesPlayed = timesPlayed;
    });

    this.scoreService.getBestScore().then(bestScore => {
      this.bestScore = bestScore;
    });
  }

  openGame() {
    this.nav.push(GamePage);
  }

  openHighscore() {

  }

  openSettings() {

  }

  openContact() {

  }
}
