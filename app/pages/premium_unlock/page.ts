import {Component} from "@angular/core";
import {NavController, Alert} from "ionic-angular";

import {AdService} from "../../providers/ads/service";
import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/premium_unlock/page.html",
})
export class PremiumUnlockPage {
  constructor(
    public nav: NavController,
    private settings: SettingsService,
    private ads: AdService
  ) {

  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Premium Unlock");
    }
  }

  ionViewLoaded() {
    let store = window["store"];
    if (!store) {
      return;
    }

    store.verbosity = store.INFO;

    store.register({
      id: this.settings.storeProduct,
      alias: "Premium version",
      type: store.NON_CONSUMABLE
    });

    store.when("Premium version")
      .approved(order => {
        this.settings.enablePremium().then(() => {
          order.finish();
          this.ads.removeBanner();
        });
      })
      .refunded(() => {
        this.settings.disablePremium();
      });

    store.refresh();

    store.error(() => {
      this.showStoreError();
    });
  }

  showStoreError() {
    let alert = Alert.create({
      title: "Purchase Error",
      message: `
        We could not reach the Store ordering server.
        Please ensure you are connected to the Internet and try again.
      `,
      buttons: ["OK"]
    });

    this.nav.present(alert);
  }

  makeOrder() {
    let store = window["store"];
    if (!store) {
      this.showStoreError();
      return;
    }

    store.order("Premium version");
  }

  restoreOrder() {
    let store = window["store"];
    if (!store) {
      this.showStoreError();
      return;
    }

    if (!store.restore) {
      let alert = Alert.create({
        title: "Restore not supported",
        buttons: ["OK"]
      });

      this.nav.present(alert);
      return;
    }

    store.restore();
  }
}
