import {Page, NavController} from 'ionic-framework/ionic';

import {filter} from 'lodash';

import {CountryService} from '../country/service';
import {CountryModel} from '../country/model';

@Page({
  templateUrl: 'build/country_list/page.html'
})
export class CountryListPage {
  constructor(nav: NavController, countryService: CountryService) {
    this.nav = nav;
    this.countryService = countryService;

    countryService.initialize();
  }

  selectCountry(country:CountryModel) {
    this.countryService.setCurrent(country);

    this.nav.pop();
  }
}