import {Injectable} from "angular2/core";

import {SettingsService} from "../settings/service";

@Injectable()
export class AdService {
  constructor(private settings: SettingsService) {
  }

  showBanner() {
    if (!window.AdMob) {
      return;
    }

    window.AdMob.createBanner({
      adId: this.getConfiguration().banner,
      position: window.AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
    });
  }

  prepareFullScreen() {
    if (!window.AdMob) {
      return;
    }

    window.AdMob.prepareInterstitial({
      adId: this.getConfiguration().full_screen,
      autoShow: false
    });
  }

  showFullScreen() {
    if (!window.AdMob) {
      return;
    }

    window.AdMob.showInterstitial();
  }

  getConfiguration() {
    return {
      banner: this.settings.smallBanner,
      full_screen: this.settings.bigBanner
    };
  }
}
