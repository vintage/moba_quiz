import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {shuffle, filter, merge} from 'lodash';

import {ItemModel} from './model';

@Injectable()
export class ItemService {
    items:ItemModel[];

    constructor(http:Http) {
        this.http = http;
    }

    Initialize() {
        return this.http.get('data/items.json')
            .subscribe(res => {
                json = res.json();
                this.items = [];
                json.map(itemJson => {
                    this.items.push(new ItemModel(itemJson));
                });
            });
    }

    GetAllRandom() {
        return shuffle(this.items);
    }

    GetNext() {
        var items = filter(this.GetAllRandom(), node => {
            return node.from.length > 0;
        });
        return items[0];
    }

    GetComponents(item:ItemModel) {
        var valid = this.GetValidComponents(item);
        var invalid = this.GetInvalidComponents(item);

        var components = valid.concat(invalid.slice(0, 12 - valid.length));
        return shuffle(components);
    }

    GetValidComponents(item:ItemModel) {
        return filter(this.GetAllRandom(), node => {
            return item.from.indexOf(node.id) != -1;
        });
    }

    GetInvalidComponents(item:ItemModel) {
        return filter(this.GetAllRandom(), node => {
            return item.id != node.id;
        });
    }
}