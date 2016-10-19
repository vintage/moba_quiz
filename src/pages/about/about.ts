import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";
import {EmailComposer, InAppBrowser} from "ionic-native";
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
    let url: string = "http://facebook.com/puppy.box.studio/";

    InAppBrowser.open(url, "_blank");
  }

  openContact() {
    if (!window['cordova']) {
      return this.showContactAlert();
    }

    EmailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        let email = {
          to: "puppy.box@outlook.com",
          subject: "Contact form"
        };
        EmailComposer.open(email);
      } else {
        this.showContactAlert();
      }
    });
  }
}
