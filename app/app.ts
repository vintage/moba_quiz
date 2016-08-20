import {HTTP_PROVIDERS} from "@angular/http";
import {Component} from "@angular/core";
import {App, ionicBootstrap, Platform} from 'ionic-angular';
import { MediaPlugin, Splashscreen, StatusBar } from 'ionic-native';

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

  initializeStore() {
    let store = window["store"];
    if (!store) {
      return;
    }

    store.verbosity = store.INFO;

    store.register({
      id: this.settings.storeProduct,
      alias: "Premium version",
      type: store.NON_CONSUMABLE
    });

    store.when(this.settings.storeProduct)
      .approved(order => {
        this.settings.enablePremium().then(() => {
          order.finish();
          this.ads.removeBanner();
        });
      })
      .refunded(() => {
        this.settings.disablePremium();
      });

    store.refresh();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      let musicPath: string;
      if (this.platform.is("android")) {
        musicPath = '/android_asset/www/sfx/background.mp3';
      } else {
        musicPath = 'sfx/background.mp3';
      }

      window['backgroundMusic'] = new MediaPlugin(musicPath);
      window['playMusic'](window['backgroundMusic']);

      Splashscreen.hide();
      StatusBar.styleDefault();

      this.settings.load().then(() => {
        this.initializeStore();

        if (window["analytics"]) {
          window["analytics"].startTrackerWithId(this.settings.trackingId);
        }

        this.settings.isPremium().then(isPremium => {
          if (!isPremium) {
            this.ads.showBanner();
          }
        }).catch(() => {
          this.ads.showBanner();
        });
      });
    }).catch(() => {
      this.settings.load().then(() => {
        this.initializeStore();
      });
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