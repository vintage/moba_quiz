import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {shuffle, filter, random} from 'lodash';

import {ItemModel} from './model';

@Injectable()
export class ItemService {
    items:ItemModel[];

    constructor(http:Http) {
        this.http = http;
    }

    initialize() {
        return this.http.get('data/items.json')
            .subscribe(res => {
                json = res.json();
                this.items = [];
                json.map(itemJson => {
                    this.items.push(new ItemModel(itemJson));
                });
            });
    }

    getAny() {
        let items = filter(this.items, node => {
            return node.from.length > 0;
        });
        let index = random(0, items.length - 1);

        return items[index];
    }

    getComponents(item:ItemModel) {
        let valid = this.getValidComponents(item);
        let invalid = this.getInvalidComponents(item);

        let components = valid.concat(invalid.slice(0, 12 - valid.length));
        return components;
    }

    getValidComponents(item:ItemModel) {
        return filter(this.items, node => {
            return item.from.indexOf(node.id) != -1;
        });
    }

    getInvalidComponents(item:ItemModel) {
        return filter(shuffle(this.items), node => {
            return item.id != node.id;
        });
    }
}