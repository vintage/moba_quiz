import {HTTP_PROVIDERS} from "@angular/http";
import {App, IonicApp, Platform} from "ionic-angular";

import {ItemService} from "./providers/item/service";
import {ChampionService, SkillService} from "./providers/champion/service";
import {GameplayService} from "./providers/gameplay/service";
import {CountryService} from "./providers/country/service";
import {ScoreService} from "./providers/score/service";
import {AdService} from "./providers/ads/service";
import {AchievementService} from "./providers/achievement/service";
import {SettingsService} from "./providers/settings/service";

import {MainMenuPage} from "./pages/main_menu/page";

@App({
  prodMode: true,
  config: {
    statusbarPadding: false
  },
  templateUrl: "build/app.html",
  providers: [
    ItemService,
    ChampionService,
    SkillService,
    GameplayService,
    CountryService,
    ScoreService,
    AdService,
    AchievementService,
    SettingsService,
    HTTP_PROVIDERS,
  ]
})
class MobaApp {
  root: any;

  constructor(
    public app: IonicApp,
    public platform: Platform,
    private ads: AdService,
    private settings: SettingsService
  ) {
    this.root = MainMenuPage;

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      window.navigator.splashscreen.hide();

      if (typeof StatusBar !== "undefined") {
        StatusBar.styleDefault();
      }

      this.settings.load().then(() => {
        this.ads.showBanner();
      });
    }).catch(() => {
      this.settings.load();
    });
  }
}
