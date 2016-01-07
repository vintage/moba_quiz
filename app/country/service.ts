import {Storage, LocalStorage} from 'ionic-framework/ionic'
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {filter} from 'lodash';


import {CountryModel} from './model';

@Injectable()
export class CountryService {
    objects:CountryModel[];

    constructor(http:Http) {
        this.http = http;
        this.storage = new Storage(LocalStorage);
    }

    initialize() {
        this.objects = [];

        return this.http.get('data/countries.json')
            .subscribe(res => {
                json = res.json();
                json.map(jsonObject => {
                    this.objects.push(new CountryModel(jsonObject));
                });
            });
    }

    getAll() {
        return this.objects;
    }

    setCurrent(country:CountryModel) {
        this.storage.set('current_country', country.id);
    }

    getCurrent() {
        return this.storage.get('current_country').then(current => {
            return filter(this.objects, country => {
                return country.id == current;
            })[0];
        });
    }
}