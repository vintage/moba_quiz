import {Component} from "@angular/core";
import {NavController, Alert} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/premium_unlock/page.html",
})
export class PremiumUnlockPage {
  constructor(public nav: NavController, private settings: SettingsService) {

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
      id: "com.puppybox.purchase.premium_version",
      alias: "Premium version",
      type: store.NON_CONSUMABLE
    });

    store.when("Premium version")
      .approved(order => {
        this.settings.enablePremium().then(() => {
          order.finish();
        });
      })
      .refunded(() => {
        this.settings.disablePremium();
      });

    store.refresh();

    // Call restore if supported
    if (store.restore) {
      store.restore();
    }

    store.error(e => {
      this.showStoreError(e);
    });
  }

  showStoreError(error: any = null) {
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
      return;
    }

    store.order("Premium version");
  }
}
