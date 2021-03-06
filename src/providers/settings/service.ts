import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Platform } from "ionic-angular";
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsService {
  isLoaded: boolean;
  premiumKey: string = "premium_key";
  musicEnabledKey: string = "settings_music_enabled";
  soundEnabledKey: string = "settings_sound_enabled";
  vibrationEnabledKey: string = "settings_vibration_enabled";
  languageKey: string = "settings_language";
  rateAppKey: string = "settings_rate_app";
  likeAppKey: string = "settings_like_app";
  followAppKey: string = "settings_follow_app";
  downloadVaultombKey: string = "settings_download_vaultomb";
  currentLanguage: string;

  adBanner: string;
  adInterstitial: string;
  adRewardVideo: string;
  legalDisclaimer: string;
  highscoreUrl: string;
  appUrl: string;
  sourceName: string;
  sourceUrl: string;
  trackingId: string;
  storeProduct: string;

  constructor(public platform: Platform, public http: Http, public storage: Storage) {
    this.isLoaded = false;
  }

  load() {
    if (this.isLoaded) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.http.get("assets/data/settings.json").subscribe(res => {
        let json = res.json();

        this.legalDisclaimer = json["legal_disclaimer"];
        this.highscoreUrl = json["highscore_url"];
        this.sourceName = json["source_name"];
        this.sourceUrl = json["source_url"];

        let platformSettings = {};
        if (this.platform.is("ios")) {
          platformSettings = json["ios"];
        } else if (this.platform.is("android")) {
          platformSettings = json["android"];
        } else {
          platformSettings = json["android"];
        }

        this.adBanner = platformSettings["ad_banner"];
        this.adInterstitial = platformSettings["ad_interstitial"];
        this.adRewardVideo = platformSettings["ad_reward"];
        this.trackingId = platformSettings["tracking"];
        this.appUrl = platformSettings["store"];
        this.storeProduct = platformSettings["store_premium"];

        this.isLoaded = true;
        resolve(null);
      });
    });
  }

  isPremium(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.platform.is('windows')) {
        return resolve(true);
      }

      return this.storage.get(this.premiumKey).then(isPremium => {
        resolve(!!isPremium);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  enablePremium(): Promise<any> {
    return this.storage.set(this.premiumKey, JSON.stringify(true));
  }

  disablePremium(): Promise<any> {
    return this.storage.remove(this.premiumKey);
  }

  isSettingsEnabled(key: string, defaultValue: boolean = true): Promise<boolean> {
    return new Promise(resolve => {
      return this.storage.get(key).then(isEnabled => {
        isEnabled = JSON.parse(isEnabled);
        if (isEnabled === null) {
          isEnabled = defaultValue;
        }
        resolve(!!isEnabled);
      }).catch(() => {
        resolve(true);
      });
    });
  }

  setSettings(key: string, value: any): Promise<any> {
    return this.storage.set(key, JSON.stringify(value));
  }

  isMusicEnabled(): Promise<boolean> {
    return this.isSettingsEnabled(this.musicEnabledKey);
  }

  setMusic(enabled: boolean): Promise<any> {
    return this.setSettings(this.musicEnabledKey, enabled);
  }

  isSoundEnabled(): Promise<boolean> {
    return this.isSettingsEnabled(this.soundEnabledKey);
  }

  setSound(enabled: boolean): Promise<any> {
    return this.setSettings(this.soundEnabledKey, enabled);
  }

  isVibrationEnabled(): Promise<boolean> {
    return this.isSettingsEnabled(this.vibrationEnabledKey);
  }

  setVibration(enabled: boolean): Promise<any> {
    return this.setSettings(this.vibrationEnabledKey, enabled);
  }

  getLanguageSync(): string {
    return this.currentLanguage;
  }

  getLanguage(): Promise<string> {
    return new Promise(resolve => {
      this.storage.get(this.languageKey).then(code => {
        this.currentLanguage = code;

        resolve(code);
      });
    });
  }

  setLanguage(code: string): Promise<any> {
    this.currentLanguage = code;

    return this.storage.set(this.languageKey, code);
  }

  isAppRated(): Promise<boolean> {
    return this.isSettingsEnabled(this.rateAppKey, false);
  }

  rateApp(): Promise<any> {
    return this.setSettings(this.rateAppKey, true);
  }

  isAppLiked(): Promise<boolean> {
    return this.isSettingsEnabled(this.likeAppKey, false);
  }

  likeApp(): Promise<any> {
    return this.setSettings(this.likeAppKey, true);
  }

  isAppFollowed(): Promise<boolean> {
    return this.isSettingsEnabled(this.followAppKey, false);
  }

  followApp(): Promise<any> {
    return this.setSettings(this.followAppKey, true);
  }

  isVaultombDownloaded(): Promise<boolean> {
    return this.isSettingsEnabled(this.downloadVaultombKey, false);
  }

  downloadVaultomb(): Promise<any> {
    return this.setSettings(this.downloadVaultombKey, true);
  }
}
