import {Component} from "@angular/core";
import {AlertController} from "ionic-angular";
import {EmailComposer, InAppBrowser} from 'ionic-native';

import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/about/page.html",
})
export class AboutPage {
  disclaimer: string;

  constructor(
    private alertCtrl: AlertController,
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
      title: "Missing email client",
      message: "Contact us at puppy.box@outlook.com"
    });

    alert.present();
  }

  openHomepage() {
    // let url: string = "http://facebook.com/puppy.box.studio/";

    // let browser = new InAppBrowser(url, '_system');
    // browser.open();
  }

  openContact() {
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
