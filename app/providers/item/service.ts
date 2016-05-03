import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {shuffle, random} from "lodash";

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
        let json = res.json();
        this.items = json.map(data => {
          return new ItemModel(data);
        });

        resolve(this.items);
      });
    });
  }

  getAny() {
    let items = this.items.filter(node => {
      return node.from.length > 0 && node.price > 0;
    });
    let index = random(0, items.length - 1);

    return items[index];
  }

  getValidComponents(item: ItemModel) {
    let components = [];

    this.items.forEach(node => {
      item.from.filter(component => {
        return component === node.id;
      }).map(component => {
        components.push(node);
      });
    });

    return components;
  }

  getInvalidComponents(item: ItemModel) {
    return shuffle(this.items).filter(node => {
      return item.id !== node.id && item.from.indexOf(node.id) === -1;
    });
  }
}
