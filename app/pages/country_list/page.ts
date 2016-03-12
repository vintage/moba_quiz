import {Page, NavController} from "ionic-angular";
import {filter} from "lodash";

import {CountryService} from "../../providers/country/service";
import {CountryModel} from "../../providers/country/model";

@Page({
  templateUrl: "build/pages/country_list/page.html"
})
export class CountryListPage {
  countries: CountryModel[];

  constructor(public nav: NavController, public countryService: CountryService) {
    countryService.load().then(countries => {
      this.countries = countries;
    });
  }

  selectCountry(country: CountryModel) {
    this.countryService.setCurrent(country);

    this.nav.pop();
  }
}
