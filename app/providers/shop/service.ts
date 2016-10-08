import {Storage, SqlStorage} from "ionic-angular";

import {ShopItem} from "./model";

export class ShopService {
  storage: Storage;
  items: ShopItem[];

  constructor() {
    this.storage = new Storage(SqlStorage);
    this.items = [
      new ShopItem("extra_life", "Extra Life", 1000, 1),
      new ShopItem("skip_questions", "Skip 3 Questions", 1400, 3),
      new ShopItem("hardcore_ticket", "Hardcore Ticket", 2000, 1),
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

  private getStorageKey(item: ShopItem): string {
    return "shop_item_" + item.id;
  }

  private getItemById(id: string): ShopItem {
    return this.items.filter(item => {
      return item.id === id;
    })[0];
  }

  getItemAmount(itemId: string): Promise<number> {
    let item = this.getItemById(itemId);

    return new Promise(resolve => {
      let storageKey = this.getStorageKey(item);
      this.storage.get(storageKey).then(amount => {
        resolve(parseInt(amount || 0));
      });
    });
  }

  setItemAmount(itemId: string, amount: number): Promise<number> {
    let item = this.getItemById(itemId);

    return new Promise(resolve => {
      let storageKey = this.getStorageKey(item);
      
      if (amount < 0) {
        amount = 0;
      }

      this.storage.set(storageKey, amount).then(() => {
        resolve(amount);
      });
    });
  }

  decreaseItemAmount(itemId: string): Promise<number> {
    return new Promise(resolve => {
      this.getItemAmount(itemId).then(amount => {
        let decreased = amount - 1;
        this.setItemAmount(itemId, decreased).then(() => {
          resolve(decreased);
        });
      });
    });
  }

  isPurchasable(item: ShopItem) {
    return new Promise(resolve => {
      this.getCoins().then(coins => {
        if (coins < item.price) {
          return resolve(false);
        }

        this.getItemAmount(item.id).then(amount => {
          resolve(amount === 0);
        });
      });
    });
  }

  buyItem(item: ShopItem) {
    return new Promise(resolve => {
      this.isPurchasable(item).then(isPurchasable => {
        if (isPurchasable) {
          let storageKey = this.getStorageKey(item);

          this.storage.set(storageKey, item.amount).then(() => {
            this.spendCoins(item.price).then(() => {
              resolve(true);
            });
          });
        } else {
          resolve(false);
        }
      });
    });
  }
}
