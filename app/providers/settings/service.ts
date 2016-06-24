import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Platform} from "ionic-angular";


@Injectable()
export class SettingsService {
  isLoaded: boolean;

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

        let adData = {};
        if (this.platform.is("ios")) {
          this.appUrl = json["urls"]["ios"];
          this.trackingId = json["tracking"]["ios"];
          adData = json["ads"]["ios"];
        }
        else if (this.platform.is("android")) {
          this.appUrl = json["urls"]["android"];
          this.trackingId = json["tracking"]["android"];
          adData = json["ads"]["android"];
        }
        else {
          this.appUrl = json["urls"]["windows"];
          this.trackingId = json["tracking"]["windows"];
          adData = json["ads"]["default"];
        }

        this.smallBanner = adData["small"];
        this.bigBanner = adData["full_screen"];

        this.isLoaded = true;
        resolve(null);
      });
    });
  }
}
