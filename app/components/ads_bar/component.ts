import {Component} from "angular2/core";

@Component({
  selector: "ads-bar",
  template: ""
})
export class AdsBar {
  constructor() {
    let admobid = {
      banner: "ca-app-pub-4764697513834958/3928703662",
      interstitial: "ca-app-pub-4764697513834958/8725226061"
    };

    // TODO: Move configuration to some settings file
    // TODO: Separate ads unit per platform WP/Android/iOS

    if(window.AdMob) {
      window.AdMob.createBanner({
        adId: admobid.banner,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: true
      });
    }
  }
}
