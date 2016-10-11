import { Injectable } from "@angular/core";

import { SettingsService } from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {}

  initialize() {
    let config = this.getConfiguration();

    let video = this.getVideoEngine();
    video.setOptions({
      appId: config.rewardVideoId,
      appKey: config.rewardVideoKey
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
    let engine = window["Chartboost"];
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
      adSize: "SMART_BANNER",
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

  prepareRewardVideo() {
    let engine = this.getVideoEngine();
    if (!engine) {
      return;
    }

    engine.prepareInterstitial({
      adId: "video/Item Store",
      autoShow: false
    });
  }

  showRewardVideo() {
    let engine = this.getVideoEngine();
    if (!engine) {
      return;
    }

    engine.showInterstitial();
  }
}
