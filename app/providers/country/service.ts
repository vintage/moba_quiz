import {Storage, SqlStorage} from 'ionic-framework/ionic'
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {filter, sortBy} from 'lodash';

import {CountryModel} from './model';

@Injectable()
export class CountryService {
  private objects: CountryModel[];
  private current: CountryModel;

  constructor(http: Http) {
    this.http = http;
    this.storage = new Storage(SqlStorage);
  }

  load() {
    if (this.objects) {
      return Promise.resolve(this.objects);
    }

    this.objects = [];
    return new Promise(resolve => {
      this.http.get('data/countries.json')
        .subscribe(res => {
        let json = res.json();
        json.map(jsonObject => {
          this.objects.push(new CountryModel(jsonObject));
        });
        this.objects = sortBy(this.objects, 'name');
        resolve(this.objects);
      });
    });
  }

  setCurrent(country: CountryModel) {
    this.current = country;
    this.storage.set('current_country', country.id);
  }

  getCurrent() {
    if (this.current) {
      return Promise.resolve(this.current);
    }

    return this.storage.get('current_country').then(currentId => {
      let current = filter(this.objects, country => {
        return country.id == currentId;
      })[0];

      this.current = current;
      return current;
    });
  }
}
