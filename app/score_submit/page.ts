import {Page, NavController} from 'ionic-framework/ionic';

import {GameplayService} from "../gameplay/service";

@Page({
  templateUrl: 'build/score_submit/page.html'
})
export class ScoreSubmitPage {
  constructor(nav: NavController, gameplayService: GameplayService) {
    this.nav = nav;
    this.gameplay = gameplayService;
  }
}