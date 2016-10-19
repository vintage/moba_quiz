import {Component, ApplicationRef} from "@angular/core";
import {AlertController} from "ionic-angular";
import {InAppBrowser} from "ionic-native";
import {TranslateService} from 'ng2-translate/ng2-translate';

import {SettingsService} from "../../providers/settings/service";
import {AdService} from "../../providers/ads/service";
import {ShopService} from "../../providers/shop/service";
import {ShopItem} from "../../providers/shop/model";
import {MusicService} from "../../providers/music/service";

@Component({
  selector: 'page-shop',
  templateUrl: "shop.html",
})
export class ShopPage {
  coins: number;
  isVideoReady: boolean;
  isVideoPlayed: boolean;
  isAppRated: boolean;
  isAppLiked: boolean;
  items: ShopItem[];
  itemsAvailability: Object;

  constructor(
    private appRef: ApplicationRef,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private settings: SettingsService,
    private shop: ShopService,
    private ads: AdService,
    private music: MusicService
  ) {
    this.isVideoReady = false;
    this.isVideoPlayed = false;
    this.isAppRated = true;
    this.isAppLiked = true;
    this.itemsAvailability = {};
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Shop");
    }
  }

  ionViewWillEnter() {
    this.items = this.shop.items;
    this.updateState();

    this.settings.isAppRated().then(v => this.isAppRated = v);
    this.settings.isAppLiked().then(v => this.isAppLiked = v);

    this.registerAdHandlers();
    this.ads.prepareRewardVideo();
  }

  registerAdHandlers() {
    let chartboost = window['chartboost'];
    if (!chartboost) {
      return false;
    }

    chartboost.onRewardedVideoAdShown = (location) => {
      this.isVideoPlayed = true;
      this.music.pause();
    };

    chartboost.onRewardedVideoAdLoaded = (location) => {
      if (!this.isVideoReady) {
        this.isVideoReady = true;
        this.appRef.tick();
      }
    };

    chartboost.onRewardedVideoAdCompleted = (location) => {
      if (this.isVideoReady && this.isVideoPlayed) {
        this.isVideoPlayed = false;
        this.isVideoReady = false;
        this.music.start();
        
        this.shop.addCoins(1000).then(coins => {
          return this.updateState();
        }).then(() => {
          this.appRef.tick();
          this.ads.prepareRewardVideo();
        });
      }
    };

    if (chartboost.loadedRewardedVideoAd()) {
      this.isVideoReady = true;
    }

    return true;
  }

  updateState() {
    return new Promise(resolve => {
      this.updateCoins().then(() => {
        this.updateItemsAvailability();
        resolve();
      });
    });
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

        // TODO: Remove it from here and return Promise instead
        this.appRef.tick();
      });
    });
  }

  showStoreError() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('Purchase error'),
      message: this.translate.instant('We could not reach the Store ordering server. Please ensure you are connected to the Internet and try again.'),
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
        title: this.translate.instant('Restore not supported'),
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

  rateApp() {
    this.isAppRated = true;

    let url: string = this.settings.appUrl;

    this.settings.rateApp().then(() => {
      return this.shop.addCoins(5000);
    }).then(() => {
      InAppBrowser.open(url, "_system");
    });
  }

  likeApp() {
    this.isAppLiked = true;

    let url: string = "http://facebook.com/puppy.box.studio/";

    this.settings.likeApp().then(() => {
      return this.shop.addCoins(5000);
    }).then(() => {
      InAppBrowser.open(url, "_system");
    });
  }
}
