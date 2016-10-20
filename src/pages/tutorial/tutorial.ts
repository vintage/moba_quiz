import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {InAppBrowser} from 'ionic-native';

import {SettingsService} from "../../providers/settings/service";

@Component({
  selector: 'page-tutorial',
  templateUrl: "tutorial.html",
})
export class TutorialPage {
  sourceName: string;
  sourceUrl: string;

  constructor(public nav: NavController, private settings: SettingsService) {
    this.sourceName = settings.sourceName;
    this.sourceUrl = settings.sourceUrl;
  }

  openSourcePage() {
    InAppBrowser.open(this.sourceUrl, "_blank");
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Tutorial");
    }
  }
}