import {HTTP_PROVIDERS} from "@angular/http";
import {Component} from "@angular/core";
import {App, ionicBootstrap, Platform} from 'ionic-angular';

import {ItemService} from "./providers/item/service";
import {ChampionService, SkillService} from "./providers/champion/service";
import {GameplayService} from "./providers/gameplay/service";
import {CountryService} from "./providers/country/service";
import {ScoreService} from "./providers/score/service";
import {AdService} from "./providers/ads/service";
import {AchievementService} from "./providers/achievement/service";
import {SettingsService} from "./providers/settings/service";

import {MainMenuPage} from "./pages/main_menu/page";

@Component({
  templateUrl: "build/app.html",
})
class MobaApp {
  root: any;

  constructor(
    private app: App,
    public platform: Platform,
    private ads: AdService,
    private settings: SettingsService
  ) {
    this.root = MainMenuPage;

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (window.Media) {
        if (this.platform.is("android")) {
          window.backgroundMusic = new window.Media('/android_asset/www/sfx/background.mp3');
        }
        else {
          window.backgroundMusic = new window.Media('sfx/background.mp3');
        }

        window.playMusic(window.backgroundMusic);
      }

      window.navigator.splashscreen.hide();

      if (typeof StatusBar !== "undefined") {
        StatusBar.styleDefault();
      }

      this.settings.load().then(() => {
        this.ads.showBanner();
        if (window["analytics"]) {
          window["analytics"].startTrackerWithId(this.settings.trackingId);
        }
      });
    }).catch(() => {
      this.settings.load();
    });
  }
}

ionicBootstrap(MobaApp, [
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
  ], {
    statusbarPadding: false,
    prodMode: true
  }
);