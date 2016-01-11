import {OnInit} from 'angular2/core';
import {Button, Page, NavController, Alert} from 'ionic-framework/ionic';

import {GameplayService} from "../gameplay/service";
import {CountryListPage} from "../country_list/page";
import {CountryService} from "../country/service";
import {CountryModel} from "../country/model";
import {GamePage} from "../game/game";
import {ScoreService} from "../score/service";
import {MainMenuPage} from "../main_menu/page";

@Page({
  templateUrl: 'build/score_submit/page.html',
  directives: [Button]
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

  ngOnInit() {
    this.scoreService.getBestScore().then(bestScore => {
      if(bestScore < this.gameplay.points) {
        this.scoreService.setBestScore(this.gameplay.points);
      }
    });
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
    this.nav.push(GamePage);
  }

  openMenu() {
    this.nav.push(MainMenuPage);
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
        let alert = Alert.create({
          title: "Score hasn't been saved",
          subTitle: 'Check your internet connection and try again.',
          buttons: ['OK']
        });
        this.nav.present(alert);
      }
    });
  }
}
