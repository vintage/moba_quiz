import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {shuffle, filter, random} from "lodash";

import {ItemModel} from "./model";

@Injectable()
export class ItemService {
  items: ItemModel[];

  constructor(public http: Http) {
  }

  load() {
    if (this.items) {
      return Promise.resolve(this.items);
    }

    return new Promise(resolve => {
      this.http.get("data/items.json").subscribe(res => {
        this.items = [];

        let json = res.json();
        json.map(itemJson => {
          this.items.push(new ItemModel(itemJson));
        });

        resolve(this.items);
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

  getComponents(item: ItemModel) {
    let valid = this.getValidComponents(item);
    let invalid = this.getInvalidComponents(item);

    let components = valid.concat(invalid.slice(0, 12 - valid.length));
    return components;
  }

  getValidComponents(item: ItemModel) {
    return filter(this.items, node => {
      return item.from.indexOf(node.id) !== -1;
    });
  }

  getInvalidComponents(item: ItemModel) {
    return filter(shuffle(this.items), node => {
      return item.id !== node.id;
    });
  }
}
