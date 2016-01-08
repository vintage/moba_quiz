import {OnInit} from 'angular2/core';
import {Button, Page, NavController} from 'ionic-framework/ionic';

import {GamePage} from "../game/game";

@Page({
  templateUrl: 'build/main_menu/page.html',
  directives: [Button]
})
export class MainMenuPage implements OnInit {
  constructor(nav: NavController) {
    this.nav = nav;
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