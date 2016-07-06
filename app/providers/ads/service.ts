import {Injectable} from "@angular/core";

import {SettingsService} from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {
  }

  getEngine() {
    let engine = window["AdMob"];
    return engine;
  }

  showBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.createBanner({
      adId: this.getConfiguration().banner,
      position: engine.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
    });
  }

  removeBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.removeBanner();
  }

  prepareFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.prepareInterstitial({
      adId: this.getConfiguration().full_screen,
      autoShow: false
    });
  }

  showFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.showInterstitial();
  }

  getConfiguration() {
    return {
      banner: this.settings.smallBanner,
      full_screen: this.settings.bigBanner
    };
  }
}
