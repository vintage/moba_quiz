import {OnInit} from 'angular2/core';
import {Button, Page, NavController} from 'ionic-framework/ionic';

import {GameplayService} from "../gameplay/service";
import {CountryListPage} from "../country_list/page";
import {CountryService} from "../country/service";
import {CountryModel} from "../country/model";
import {GamePage} from "../game/game";
import {ScoreService} from "../score/service";

@Page({
  templateUrl: 'build/score_submit/page.html',
  directives: [Button],
  providers: [ScoreService],
})
export class ScoreSubmitPage implements OnInit {
  public country:CountryModel;
  public isPending:boolean;
  public isSubmitted:boolean;

  constructor(nav: NavController, gameplayService: GameplayService, countryService:CountryService, scoreService:ScoreService) {
    this.nav = nav;
    this.gameplay = gameplayService;
    this.countryService = countryService;
    this.scoreService = scoreService;
    this.isPending = false;
    this.isSubmitted = false;
  }

  onPageWillEnter() {
    this.countryService.initialize().add(() => {
      this.countryService.getCurrent().then(country => {
        this.country = country
      });
    });
  }

  showCountryList() {
   this.nav.push(CountryListPage);
  }

  playAgain() {
    this.gameplay.restart();
    this.nav.push(GamePage);
  }

  submitScore() {
    if(this.isPending) {
      return false;
    }

    this.isPending = true;
    this.scoreService.save('playerName', this.gameplay.points).then((is_success) => {
      this.isPending = false;

      if(is_success) {
        this.isSubmitted = true;
      }
      else {


        // TODO: Create modal/popup/whatever that score couldn't be submitted
      }
    });
  }
}