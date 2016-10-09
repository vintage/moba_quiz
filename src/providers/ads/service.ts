import { Injectable } from "@angular/core";

import { SettingsService } from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {}

  initialize() {
    let config = this.getConfiguration();

    let engine = this.getEngine();
    engine.setOptions({
      bannerId: config.banner,
      interstitialId: config.full_screen,
      adSize: "SMART_BANNER",
      position: engine.AD_POSITION.BOTTOM_CENTER
    });

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
      rewardVideoId: "57b9fa5243150f79f2a509f5",
      rewardVideoKey: "4c0a685045ec2ea625ac4e00bfd52e894e11b90e"
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
