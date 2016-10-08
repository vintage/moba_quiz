import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";
import {AdService} from "../../providers/ads/service";
import {ShopService} from "../../providers/shop/service";
import {ShopItem} from "../../providers/shop/model";

@Component({
  templateUrl: "build/pages/shop/page.html",
})
export class ShopPage {
  coins: number;
  items: ShopItem[];

  constructor(
    private alertCtrl: AlertController,
    private settings: SettingsService,
    private shop: ShopService,
    private ads: AdService
  ) {

  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Shop");
    }

    this.ads.prepareRewardVideo();

    this.items = this.shop.items;

    this.updateCoins();
  }

  updateCoins() {
    this.shop.getCoins().then(coins => {
      this.coins = coins;
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

    if (window['navigator']['connection'] && window['navigator']['connection']['type'] === window['Connection']['NONE']) {
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
      this.updateCoins();
    });
  }

  getFreeCoins() {
    window["unityads"].onRewardedVideoAdCompleted = function() {
        this.shop.addCoins(1000);
        this.updateCoins();
    };
    this.ads.showRewardVideo();
  }
}
