import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Platform} from "ionic-angular";
import {Storage, SqlStorage} from "ionic-angular";

@Injectable()
export class SettingsService {
  isLoaded: boolean;
  storage: Storage;
  premiumKey: string = "premium_key";
  musicEnabledKey: string = "settings_music_enabled";
  vibrationEnabledKey: string = "settings_vibration_enabled";

  smallBanner: string;
  bigBanner: string;
  videoBanner: string;
  legalDisclaimer: string;
  highscoreUrl: string;
  appUrl: string;
  sourceName: string;
  sourceUrl: string;
  trackingId: string;
  storeProduct: string;

  constructor(public platform: Platform, public http: Http) {
    this.isLoaded = false;
    this.storage = new Storage(SqlStorage);
  }

  load() {
    if (this.isLoaded) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.http.get("data/settings.json").subscribe(res => {
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
          platformSettings = json["windows"];
        }

        this.smallBanner = platformSettings["ad_small"];
        this.bigBanner = platformSettings["ad_big"];
        // this.videoBanner = platformSettings["ad_video"];
        this.videoBanner = "1157886";

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
      return this.storage.get(this.premiumKey).then(isPremium => {
        resolve(!!isPremium);
      }).catch(() => {
        resolve(false);
      });
    });
  }

  enablePremium() {
    return this.storage.set(this.premiumKey, JSON.stringify(true));
  }

  disablePremium() {
    return this.storage.remove(this.premiumKey);
  }

  isSettingsEnabled(key: string): Promise<boolean> {
    return new Promise(resolve => {
      return this.storage.get(key).then(isEnabled => {
        resolve(!!JSON.parse(isEnabled));
      }).catch(() => {
        resolve(true);
      });
    });
  }

  setSettings(key: string, value: any) {
    return this.storage.set(key, JSON.stringify(value));
  }

  isMusicEnabled() {
    return this.isSettingsEnabled(this.musicEnabledKey);
  }

  setMusic(enabled: boolean) {
    return this.setSettings(this.musicEnabledKey, enabled);
  }

  isVibrationEnabled() {
    return this.isSettingsEnabled(this.vibrationEnabledKey);
  }

  setVibration(enabled: boolean) {
    return this.setSettings(this.vibrationEnabledKey, enabled);
  }
}
