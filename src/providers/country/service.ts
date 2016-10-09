import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Storage } from '@ionic/storage';
import _ from "lodash";

import { CountryModel } from "./model";

@Injectable()
export class CountryService {
  private objects: CountryModel[];
  private current: CountryModel;

  constructor(public http: Http, public storage: Storage) {
  }

  load() {
    if (this.objects) {
      return Promise.resolve(this.objects);
    }

    return new Promise(resolve => {
      this.http.get("assets/data_common/countries.json").subscribe(res => {
        let json = res.json();
        this.objects = json.map(data => {
          return new CountryModel(data);
        });
        this.objects = _.sortBy(this.objects, "name");

        resolve(this.objects);
      });
    });
  }

  setCurrent(country: CountryModel) {
    this.current = country;
    this.storage.set("current_country", country.id);
  }

  getById(id: string) {
    let countries = this.objects.filter(country => {
      return country.id === id;
    });

    let country = null;
    if (countries.length > 0) {
      country = countries[0];
    }

    return country;
  }

  getCurrent() {
    if (this.current) {
      return Promise.resolve(this.current);
    }

    return this.storage.get("current_country").then(currentId => {
      this.current = this.getById(currentId);
      return this.current;
    });
  }
}
