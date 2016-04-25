import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {Platform} from "ionic-angular";


@Injectable()
export class SettingsService {
  isLoaded: boolean;

  smallBanner: string;
  bigBanner: string;
  legalDisclaimer: string;
  highscoreUrl: string;

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

        this.isLoaded = true;
        resolve(null);
      });
    });
  }
}
