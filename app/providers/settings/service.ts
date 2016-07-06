import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Platform} from "ionic-angular";
import {Storage, SqlStorage} from "ionic-angular";

@Injectable()
export class SettingsService {
  isLoaded: boolean;
  storage: Storage;
  premiumKey: string = "premium_key";

  smallBanner: string;
  bigBanner: string;
  legalDisclaimer: string;
  highscoreUrl: string;
  appUrl: string;
  sourceName: string;
  sourceUrl: string;
  trackingId: string;

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

        let platformSettings = {}

        if (this.platform.is("ios")) {
          platformSettings = json["ios"];
        }
        else if (this.platform.is("android")) {
          platformSettings = json["android"];
        }
        else {
          platformSettings = json["windows"];
        }

        this.smallBanner = platformSettings["ad_small"];
        this.bigBanner = platformSettings["ad_big"];
        this.trackingId = platformSettings["tracking"];
        this.appUrl = platformSettings["store"];

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
}
