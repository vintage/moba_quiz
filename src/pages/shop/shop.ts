import {Component, ApplicationRef} from "@angular/core";
import {AlertController, ToastController, Platform} from "ionic-angular";
import {InAppBrowser, InAppPurchase} from "ionic-native";
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
  isAppFollowed: boolean;
  isVaultombDownloaded: boolean;
  isPremium: boolean;
  items: ShopItem[];
  itemsAvailability: Object;

  constructor(
    private appRef: ApplicationRef,
    private platform: Platform,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
    this.isAppFollowed = true;
    this.itemsAvailability = {};
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Shop");
    }
  }

  ionViewWillEnter() {
    this.items = this.shop.items;
    this.shop.getCoins().then(coins => {
      this.updateState(coins);
    });

    this.settings.isAppRated().then(v => this.isAppRated = v);
    this.settings.isAppLiked().then(v => this.isAppLiked = v);
    this.settings.isAppFollowed().then(v => this.isAppFollowed = v);
    this.settings.isPremium().then(v => this.isPremium = v);
    this.settings.isVaultombDownloaded().then(v => this.isVaultombDownloaded = v);

    this.ads.prepareRewardVideo();
    this.registerAdHandlers();

    InAppPurchase.getProducts([this.settings.storeProduct]).catch(() => {
      console.log('Unable to fetch purchase products.');
    });
  }

  registerAdHandlers() {
    let adEngine = this.ads.getEngine();
    if (!adEngine) {
      return false;
    }

    document.addEventListener('admob.rewardvideo.events.LOAD', () => {
      console.log('RV loaded');
      if (!this.isVideoReady) {
        this.isVideoReady = true;
        this.appRef.tick();
      }
    });

    document.addEventListener('admob.rewardvideo.events.START', () => {
      console.log('RV shown');
      this.isVideoPlayed = true;
      this.music.pause();

      this.settings.isPremium().then(isPremium => {
        if (!isPremium) {
          this.ads.removeBanner();
        }
      });
    });

    document.addEventListener('admob.rewardvideo.events.REWARD', () => {
      console.log('RV finished');
      this.shop.addCoins(1000).then(coins => {
        return this.updateState(coins);
      }).then(() => {
        this.appRef.tick();
      });
    });

    document.addEventListener('admob.rewardvideo.events.CLOSE', () => {
      console.log('RV closed');
      this.isVideoPlayed = false;
      this.isVideoReady = false;
      this.music.start();

      this.settings.isPremium().then(isPremium => {
        if (!isPremium) {
          this.ads.showBanner();
        }
      });

      this.ads.prepareRewardVideo();
    });

    this.ads.isRewardVideoReady().then(isLoaded => {
      console.log('RV already loaded');
      if (isLoaded) {
        this.isVideoReady = true;
        this.appRef.tick();
      }
    });

    return true;
  }

  updateState(coins: number) {
    this.coins = coins;
    this.updateItemsAvailability();
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
    if (!window['cordova']) {
      return false;
    }

    if (window["navigator"]["connection"] && window["navigator"]["connection"]["type"] === window["Connection"]["NONE"]) {
      return false;
    }

    return true;
  }

  enablePremium() {
    this.settings.enablePremium().then(() => {
      this.isPremium = true;
      this.ads.removeBanner();

      let toast = this.toastCtrl.create({
        message: 'You are premium player',
        duration: 3000
      });
      toast.present();
    });
  }

  makeOrder() {
    if (!this.isStoreAvailable()) {
      this.showStoreError();
      return;
    }

    InAppPurchase
      .buy(this.settings.storeProduct)
      .then(data => {
        console.log('buy: ', JSON.stringify(data));
        this.enablePremium();
      })
      .catch(err => {
        console.log('buy error: ', JSON.stringify(err));
        this.showStoreError();
      });
  }

  restoreOrder() {
    if (!this.isStoreAvailable()) {
      this.showStoreError();
      return;
    }

    InAppPurchase
      .restorePurchases()
      .then(data => {
        console.log('restore: ', JSON.stringify(data));
        let premiumProduct = data.filter(d => {
          return d.productId === this.settings.storeProduct && !!d.transactionId;
        })[0];

        if (premiumProduct) {
          this.enablePremium();
        }
      })
      .catch(err => {
        console.log('restore error: ', JSON.stringify(err));
      });
  }

  unlockItem(item: ShopItem) {
    this.shop.buyItem(item).then(isValid => {
      this.music.play("nextLevel");
      this.updateState(this.coins - item.price);
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
    }).then(coins => {
      this.updateState(coins);
      console.log('Opening url: ', url);
      new InAppBrowser(url, '_system');
    });
  }

  downloadVaultomb() {
    this.isVaultombDownloaded = true;

    let url: string = null;
    if (this.platform.is('ios')) {
      url = 'itms-apps://itunes.apple.com/app/id1227277525';
    } else {
      url = 'market://details?id=pl.puppybox.vaultomb';
    }

    this.settings.downloadVaultomb().then(() => {
      return this.shop.addCoins(20000);
    }).then(coins => {
      this.updateState(coins);
      console.log('Opening url: ', url);
      new InAppBrowser(url, '_system');
    });
  }

  likeApp() {
    this.isAppLiked = true;

    let url: string = 'https://www.facebook.com/n/?puppy.box.studio';

    this.settings.likeApp().then(() => {
      return this.shop.addCoins(5000);
    }).then(coins => {
      this.updateState(coins);
      console.log('Opening url: ', url);
      new InAppBrowser(url, '_system');
    });
  }

  followApp() {
    this.isAppFollowed = true;

    let url: string = 'https://www.twitter.com/puppybox_mobile';

    this.settings.followApp().then(() => {
      return this.shop.addCoins(5000);
    }).then(coins => {
      this.updateState(coins);
      console.log('Opening url: ', url);
      new InAppBrowser(url, '_system');
    });
  }
}
