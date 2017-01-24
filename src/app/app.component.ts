import {Component, ApplicationRef} from "@angular/core";
import {App, Platform, Config} from "ionic-angular";
import {Splashscreen, StatusBar, Globalization} from "ionic-native";
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
    private appRef: ApplicationRef,
    public platform: Platform,
    private config: Config,
    private translate: TranslateService,
    private ads: AdService,
    private settings: SettingsService,
    private music: MusicService
  ) {
    this.initializeApp();
  }

  setLanguage() {
    return new Promise(resolve => {
      this.settings.getLanguage().then(code => {
        if (!code) {
          Globalization.getPreferredLanguage().then(language => {
            let code = language.value.substring(0, 2).toLowerCase();
            let supportedCodes = ['en', 'pl', 'fr', 'pt', 'es', 'de', 'ru', 'nl', 'hu', 'it', 'tr'];

            if (supportedCodes.indexOf(code) === -1) {
              code = 'en';
            }

            this.settings.setLanguage(code);
            this.translate.use(code);
            resolve(code);
          });
        } else {
          this.translate.use(code);
          resolve(code);
        }
      }).catch(() => {
        resolve(null);
      });
    }); 
  }

  setMusic() {
    if (!window['cordova']) {
      return false;
    }

    this.music.load().then(() => {
      this.settings.isMusicEnabled().then(isEnabled => {
        this.music.start();
        
        if (isEnabled) {
          this.music.enable();
        } else {
          this.music.disable();
        }
      });
    });
  }

  initializeApp() {
    this.translate.setDefaultLang('en');

    this.platform.ready().then(() => {
      StatusBar.hide();
      
      this.setLanguage().then(() => {
        this.setMusic();
        Splashscreen.hide();
      });

      this.settings.load().then(() => {
        if (window["analytics"]) {
          window["analytics"].startTrackerWithId(this.settings.trackingId);
        }

        this.ads.initialize(this.settings.adId);
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
