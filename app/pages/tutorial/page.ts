import {Component} from "@angular/core";
import {NavController, Alert} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/tutorial/page.html",
})
export class TutorialPage {
  sourceName: string;
  sourceUrl: string;

  constructor(public nav: NavController, private settings: SettingsService) {
    this.sourceName = settings.sourceName;
    this.sourceUrl = settings.sourceUrl;
  }

  openSourcePage() {
    if (window.cordova) {
      window.cordova.InAppBrowser.open(this.sourceUrl, "_system", "location=no");
    }
    else {
      window.open(this.sourceUrl, "_blank");
    }
  }
}
