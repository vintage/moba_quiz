import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import {CountryService} from "../../providers/country/service";
import {CountryModel} from "../../providers/country/model";

@Component({
  selector: 'page-country-list',
  templateUrl: "country-list.html"
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

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Country List");
    }
  }
}
