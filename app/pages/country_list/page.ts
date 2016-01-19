import {Page, NavController} from 'ionic-framework/ionic';

import {filter} from 'lodash';

import {CountryService} from '../../providers/country/service';
import {CountryModel} from '../../providers/country/model';

@Page({
  templateUrl: 'build/pages/country_list/page.html'
})
export class CountryListPage {
  constructor(nav: NavController, countryService: CountryService) {
    this.nav = nav;
    this.countryService = countryService;

    countryService.load();
  }

  selectCountry(country: CountryModel) {
    this.countryService.setCurrent(country);

    this.nav.pop();
  }
}
