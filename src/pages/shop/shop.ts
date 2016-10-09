import {Component, ApplicationRef} from "@angular/core";
import {AlertController} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";
import {AdService} from "../../providers/ads/service";
import {ShopService} from "../../providers/shop/service";
import {ShopItem} from "../../providers/shop/model";


@Component({
  selector: 'page-shop',
  templateUrl: "shop.html",
})
export class ShopPage {
  coins: number;
  isVideoReady: boolean;
  items: ShopItem[];
  itemsAvailability: Object;

  constructor(
    private appRef: ApplicationRef,
    private alertCtrl: AlertController,
    private settings: SettingsService,
    private shop: ShopService,
    private ads: AdService
  ) {
    this.isVideoReady = false;
    this.itemsAvailability = {};
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Shop");
    }

    this.items = this.shop.items;
    this.updateState();

    this.ads.prepareRewardVideo();

    document.addEventListener("onAdLoaded", data => {
      if (data["adNetwork"] === "Chartboost") {
        this.isVideoReady = true;
        this.appRef.tick();
      }
    });
    document.addEventListener("onAdDismiss", data => {
      if (data["adNetwork"] === "Chartboost") {
        this.isVideoReady = false;
        
        this.shop.addCoins(1000).then(coins => {
          return this.updateState();
        }).then(() => {
          this.appRef.tick();
          this.ads.prepareRewardVideo();
        });
      }
    });
  }

  updateState() {
    this.updateCoins();
    this.updateItemsAvailability();
  }

  updateCoins() {
    return this.shop.getCoins().then(coins => {
      this.coins = coins;
    });
  }

  updateItemsAvailability() {
    this.items.forEach(item => {
      this.shop.isPurchasable(item).then(isPurchasable => {
        this.itemsAvailability[item.id] = isPurchasable;
      });
    });
  }

  showStoreError() {
    let alert = this.alertCtrl.create({
      title: "Purchase Error",
      message: `
        We could not reach the Store ordering server.
        Please ensure you are connected to the Internet and try again.
      `,
      buttons: ["OK"]
    });

    alert.present();
  }

  isStoreAvailable() {
    let store = window["store"];
    if (!store) {
      return false;
    }

    if (window["navigator"]["connection"] && window["navigator"]["connection"]["type"] === window["Connection"]["NONE"]) {
      return false;
    }

    return true;
  }

  makeOrder() {
    if (!this.isStoreAvailable()) {
      this.showStoreError();
      return;
    }

    let store = window["store"];
    store.order(this.settings.storeProduct);
  }

  restoreOrder() {
    if (!this.isStoreAvailable()) {
      this.showStoreError();
      return;
    }

    let store = window["store"];
    if (!store.restore) {
      let alert = this.alertCtrl.create({
        title: "Restore not supported",
        buttons: ["OK"]
      });

      alert.present();
      return;
    }

    store.restore();
  }

  unlockItem(item: ShopItem) {
    this.shop.buyItem(item).then(isValid => {
      this.updateState();
    });
  }

  getFreeCoins() {
    this.ads.showRewardVideo();
  }
}
