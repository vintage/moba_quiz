import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import _ from "lodash";

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
      this.http.get("assets/data/items.json").subscribe(res => {
        let json = res.json();
        this.items = json.map(data => {
          return new ItemModel(data);
        });

        resolve(this.items);
      });
    });
  }

  getAll() {
    return this.items;
  }

  getAny() {
    let container = this.items;

    return _.sample(container);
  }

  getPurchasable() {
    let container = this.items.filter(i => {
      return i.price > 0;
    });

    return _.sample(container);
  }

  getBase() {
    let container = this.items.filter(i => {
      return i.from.length === 0 && i.price > 0;
    });

    return _.sample(container);
  }

  getComplex() {
    let container = this.items.filter(i => {
      return i.from.length > 0 && i.price > 0;
    });
    
    return _.sample(container);
  }

  supportRecipe() {
    return this.items.filter(node => {
      return node.from.length > 0;
    }).length > 0;
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

  getInvalidComponents(item: ItemModel, limit: number) {
    let container = this.items.filter(i => {
      return item.id !== i.id && item.from.indexOf(i.id) === -1;
    });

    return _.sampleSize(container, limit);
  }
}
