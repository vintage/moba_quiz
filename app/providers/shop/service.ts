import {Storage, SqlStorage} from "ionic-angular";

import {ShopItem} from "./model";

export class ShopService {
  storage: Storage;
  items: ShopItem[];

  constructor() {
    this.storage = new Storage(SqlStorage);
    this.items = [
      new ShopItem("Extra Life", 1000, "extra_life"),
      new ShopItem("Skip 3 Questions", 1400, "skip_questions"),
      new ShopItem("Hardcore Ticket", 2000, "hardcore_ticket"),
    ];
  }

  addCoins(amount: number): Promise<number> {
    return new Promise(resolve => {
      return this.getCoins().then(coins => {
        let newCoins = coins + amount;
        this.storage.set("shop_coins", newCoins);
        resolve(newCoins);
      });
    });
  }

  spendCoins(amount: number): Promise<number> {
    return this.addCoins(amount * -1);
  }

  getCoins(): Promise<number> {
    return new Promise(resolve => {
      this.storage.get("shop_coins").then(coins => {
        resolve(parseInt(coins) || 0);
      });
    });
  }

  buyItem(item: ShopItem) {
    console.log("trying to buy item ", item.name);

    return new Promise(resolve => {
      return this.getCoins().then(coins => {
        if (coins < item.price) {
          console.log("not enough coins");
          return resolve(false);
        }

        let itemKey = "shopitem_" + item.id;

        return this.storage.get(itemKey).then(isPurchased => {
          // Item has been purchased previously, and only unique items
          // can be buy for now.
          if (isPurchased) {
            console.log("item already purchased");
            return resolve(false);
          }

          this.storage.set(itemKey, true).then(() => {
            this.spendCoins(item.price).then(() => {
              console.log("item successfuly purchased");
              resolve(true);
            });
          });
        });
      });
    });
  }
}
