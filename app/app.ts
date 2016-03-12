import {HTTP_PROVIDERS} from "angular2/http";
import {App, IonicApp, Platform} from "ionic-angular";

import {ItemService} from "./providers/item/service";
import {ChampionService, SkillService} from "./providers/champion/service";
import {GameplayService} from "./providers/gameplay/service";
import {CountryService} from "./providers/country/service";
import {ScoreService} from "./providers/score/service";
import {AdService} from "./providers/ads/service";

import {MainMenuPage} from "./pages/main_menu/page";
// import {enableProdMode} from "angular2/core";
// enableProdMode();

@App({
  templateUrl: "build/app.html",
  providers: [
    ItemService,
    ChampionService,
    SkillService,
    GameplayService,
    CountryService,
    ScoreService,
    AdService,
    HTTP_PROVIDERS,
  ]
})
class MyApp {
  root: any;

  constructor(public app: IonicApp, public platform: Platform, public ads: AdService) {
    this.root = MainMenuPage;

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("Platform ready");

      if (typeof StatusBar !== "undefined") {
        StatusBar.styleDefault();
      }

      this.ads.showBanner();
    });
  }
}
