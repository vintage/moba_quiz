import { Injectable } from "@angular/core";

import { SettingsService } from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {}

  initialize() {
    let config = this.getConfiguration();

    let video = this.getVideoEngine();
    video.setUp(config.rewardVideoId, "video", "rewardedVideo", false);

    let engine = this.getEngine();
    engine.setOptions({
      publisherId: config.banner,
      interstitialAdId: config.full_screen,
      bannerAtTop: false,  // set to true, to put banner at top
      overlap: false,  // set to true, to allow banner overlap webview
      offsetTopBar: false,  // set to true to avoid ios7 status bar overlap
      isTesting: false,  // receiving test ad
      autoShow: false,  // auto show interstitial ad when loaded
    });
  }

  getConfiguration() {
    return {
      banner: this.settings.smallBanner,
      full_screen: this.settings.bigBanner,
      rewardVideoId: this.settings.videoBannerId,
      rewardVideoKey: this.settings.videoBannerKey
    };
  }

  getEngine() {
    let engine = window["AdMob"];
    return engine;
  }

  getVideoEngine() {
    let engine = window["unityads"];
    return engine;
  }

  showBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.createBannerView();
  }

  removeBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.destroyBannerView();
  }

  prepareFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.prepareInterstitial();
  }

  showFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.showInterstitial();
  }

  prepareRewardVideo() {
    let engine = this.getVideoEngine();
    if (!engine) {
      return;
    }

    engine.preloadRewardedVideoAd('Item Store');
  }

  showRewardVideo() {
    let engine = this.getVideoEngine();
    if (!engine) {
      return;
    }

    engine.showRewardedVideoAd('Item Store');
  }
}
