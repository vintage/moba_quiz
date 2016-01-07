import {OnInit} from 'angular2/core';
import {Button, Page, NavController} from 'ionic-framework/ionic';

import {GameplayService} from "../gameplay/service";
import {CountryListPage} from "../country_list/page";
import {CountryService} from "../country/service";
import {CountryModel} from "../country/model";

@Page({
  templateUrl: 'build/score_submit/page.html',
  directives: [Button],
})
export class ScoreSubmitPage implements OnInit {
  public country:CountryModel;

  constructor(nav: NavController, gameplayService: GameplayService, countryService:CountryService) {
    console.log(nav);
    this.nav = nav;
    this.gameplay = gameplayService;
    this.countryService = countryService;
  }

  ngOnInit() {
    this.countryService.initialize().add(() => {
      this.countryService.getCurrent().then(country => {
        this.country = country
      });
    });
  }

  showCountryList() {
   this.nav.push(CountryListPage);
  }
}