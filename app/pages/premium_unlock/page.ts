import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/premium_unlock/page.html",
})
export class PremiumUnlockPage {
  constructor(
    private alertCtrl: AlertController,
    private settings: SettingsService
  ) {

  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Premium Unlock");
    }
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
}
