import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";
import {InAppBrowser} from "ionic-native";
import {TranslateService} from 'ng2-translate/ng2-translate';

import {SettingsService} from "../../providers/settings/service";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  disclaimer: string;

  constructor(
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private settings: SettingsService) {
    this.disclaimer = settings.legalDisclaimer;
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("About");
    }
  }

  showContactAlert() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant("Missing email client"),
      message: this.translate.instant("Contact us at puppy.box@outlook.com")
    });

    alert.present();
  }

  openHomepage() {
    let url: string = 'https://www.facebook.com/n/?puppy.box.studio';

    new InAppBrowser(url, '_system');
  }

  openContact() {
    this.showContactAlert();
  }
}
