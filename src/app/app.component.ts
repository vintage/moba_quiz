import {Component} from "@angular/core";
import {App, Platform} from "ionic-angular";
import {Splashscreen, StatusBar} from "ionic-native";
import {TranslateService} from 'ng2-translate/ng2-translate';

import {AdService} from "../providers/ads/service";
import {SettingsService} from "../providers/settings/service";
import {MusicService} from "../providers/music/service";

import { MainMenuPage } from '../pages/main-menu/main-menu';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = MainMenuPage;

  constructor(
    private app: App,
    public platform: Platform,
    private translate: TranslateService,
    private ads: AdService,
    private settings: SettingsService,
    private music: MusicService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.use('pl');

    this.platform.ready().then(() => {
      this.music.start();

      this.settings.isMusicEnabled().then(isEnabled => {
        if (isEnabled) {
          this.music.enable();
        } else {
          this.music.disable();
        }
      });

      Splashscreen.hide();
      StatusBar.styleDefault();

      this.settings.load().then(() => {
        if (window["analytics"]) {
          window["analytics"].startTrackerWithId(this.settings.trackingId);
        }

        this.ads.initialize();
        this.settings.isPremium().then(isPremium => {
          if (!isPremium) {
            this.ads.showBanner();
          }
        }).catch(() => {
          this.ads.showBanner();
        });
      });
    }).catch(() => {
      this.settings.load();
    });
  }
}
