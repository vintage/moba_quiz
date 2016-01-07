import {Storage, LocalStorage} from 'ionic-framework/ionic'
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

import {filter} from 'lodash';


import {CountryModel} from './model';

@Injectable()
export class CountryService {
    private objects:CountryModel[];
    private current:CountryModel;

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
        this.current = country;
        this.storage.set('current_country', country.id);
    }

    getCurrent() {
        if(this.current) {
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