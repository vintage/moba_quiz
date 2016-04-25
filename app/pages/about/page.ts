import {Page, NavController, Alert} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";

@Page({
  templateUrl: "build/pages/about/page.html",
})
export class AboutPage {
  disclaimer: string;

  constructor(public nav: NavController, private settings: SettingsService) {
    this.disclaimer = settings.legalDisclaimer;
  }

  showContactAlert() {
    let alert = Alert.create({
      title: "Missing email client",
      message: "Contact us at puppy.box@outlook.com"
    });

    this.nav.present(alert);
  }

  openContact() {
    if (window.cordova) {
      window.cordova.plugins.email.isAvailable(function(isAvailable) {
        if (isAvailable) {
          window.cordova.plugins.email.open({
            to: "puppy.box@outlook.com",
            subject: "Contact form"
          });
        } else {
          this.showContactAlert();
        }
      });
    }
    else {
      this.showContactAlert();
    }
  }
}
