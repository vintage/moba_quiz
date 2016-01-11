import {OnInit} from 'angular2/core';
import {Button, Page, NavController} from 'ionic-framework/ionic';

import {GamePage} from "../game/game";
import {GameplayService} from "../gameplay/service";

@Page({
  templateUrl: 'build/main_menu/page.html',
  directives: [Button]
})
export class MainMenuPage {
    public timesPlayed:number;
    
  constructor(nav: NavController, gameplayService: GameplayService) {
    this.nav = nav;
    this.gameplay = gameplayService;
  }

  ngOnInit() {
    this.gameplay.getTimesPlayed().then(timesPlayed => {
      this.timesPlayed = timesPlayed;
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