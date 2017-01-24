import { Injectable } from "@angular/core";

@Injectable()
export class AdService {
  constructor() {}

  initialize(key: string) {
    let engine = this.getEngine();
    if (engine) {
      engine.setAutoCache(engine.INTERSTITIAL | engine.REWARDED_VIDEO, true);
      engine.enableRewardedVideoCallbacks(true);

      engine.initialize(
        key,
        engine.INTERSTITIAL | engine.REWARDED_VIDEO | engine.BANNER
      );
    }
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

    engine.show(engine.BANNER_BOTTOM);
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
