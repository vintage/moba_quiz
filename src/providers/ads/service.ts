import { Injectable } from "@angular/core";

import { SettingsService } from "../settings/service";

declare var HeyzapAds: any;

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {}

  initialize() {
    let engine = this.getEngine();

    let key = "34b7beab57eea2e14dc235c33f0343cd";
    let options = new HeyzapAds.Options({
      disableAutomaticPrefetch: true
    });

    return engine.start(key, options);
  }

  getEngine() {
    return HeyzapAds;
  }

  showBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.BannerAd.show(HeyzapAds.BannerAd.POSITION_BOTTOM);
  }

  removeBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.BannerAd.destroy();
  }

  prepareFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.InterstitialAd.fetch();
  }

  showFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.InterstitialAd.show();
  }

  prepareRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.IncentivizedAd.fetch();
  }

  showRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    return engine.IncentivizedAd.show();
  }
}
