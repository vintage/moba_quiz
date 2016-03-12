import {Injectable} from "angular2/core";
import {Platform} from "ionic-angular";

@Injectable()
export class AdService {
  constructor(public platform: Platform) {
  }

  showBanner() {
    if (!window.AdMob) {
      return;
    }

    window.AdMob.createBanner({
      adId: this.getConfiguration().banner,
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
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
    let conf = {
      banner: "",
      full_screen: ""
    };

    if (this.platform.is("ios")) {
      conf = {
        banner: "ca-app-pub-4764697513834958/3928703662",
        full_screen: "ca-app-pub-4764697513834958/8725226061"
      };
    }
    else if (this.platform.is("android")) {
      conf = {
        banner: "ca-app-pub-4764697513834958/4434627267",
        full_screen: "ca-app-pub-4764697513834958/4908330866"
      };
    }
    else {
      conf = {
        banner: "ca-app-pub-4764697513834958/7883646863",
        full_screen: "ca-app-pub-4764697513834958/7744046068"
      };
    }

    return conf;
  }
}
