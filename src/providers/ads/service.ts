import { Injectable } from "@angular/core";

@Injectable()
export class AdService {
  constructor() {}

  initialize(banner: string, interstitial: string, reward: string) {
    let engine = this.getEngine();
    if (engine) {
      engine.banner.config({
        id: banner,
        isTesting: false,
        autoShow: true,
        overlap: false
      });

      engine.interstitial.config({
        id: interstitial,
        isTesting: false,
        autoShow: false
      });

      engine.rewardvideo.config({
        id: reward,
        isTesting: false,
        autoShow: false
      });
    }
  }

  getEngine() {
    let engine = window["admob"];
    return engine;
  }

  showBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }
    
    engine.banner.prepare();
  }

  removeBanner() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.banner.remove();
  }

  prepareFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.interstitial.prepare();
  }

  showFullScreen() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.interstitial.show();
  }

  isFullscreenReady() {
    return new Promise(resolve => {
      let engine = this.getEngine();
      if (!engine) {
        resolve(false);
      } else {
        engine.interstitial.isReady().then(isReady => {
          resolve(isReady);
        });
      }
    });
  }

  prepareRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.rewardvideo.prepare();
  }

  showRewardVideo() {
    let engine = this.getEngine();
    if (!engine) {
      return;
    }

    engine.rewardvideo.show();
  }

  isRewardVideoReady() {
    return new Promise(resolve => {
      let engine = this.getEngine();
      if (!engine) {
        resolve(false);
      } else {
        engine.rewardvideo.isReady().then(isReady => {
          resolve(isReady);
        });
      }
    });
  }
}