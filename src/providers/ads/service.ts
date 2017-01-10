import { Injectable } from "@angular/core";

import { SettingsService } from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {}

  initialize() {
    let config = this.getConfiguration();

    let engine = this.getEngine();
    if (engine) {
      engine.setAutoCache(engine.INTERSTITIAL, false);

      engine.initialize(
        config.adId,
        engine.INTERSTITIAL | engine.BANNER | engine.REWARDED_VIDEO
      );
    }
  }

  getConfiguration() {
    return {
      adId: this.settings.adId
    };
  }

  getEngine() {
    let engine = window["Appodeal"];
    return engine;
  }

  showBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.show(engine.BANNER);
  }

  removeBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.hide(engine.BANNER);
  }

  prepareFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.cache(engine.INTERSTITIAL);
  }

  showFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.show(engine.INTERSTITIAL);
  }

  prepareRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.cache(engine.REWARDED_VIDEO);
  }

  showRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.show(engine.REWARDED_VIDEO);
  }
}
