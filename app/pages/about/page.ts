import {Component} from "@angular/core";
import {NavController, Alert} from "ionic-angular";

import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/about/page.html",
})
export class AboutPage {
  disclaimer: string;

  constructor(public nav: NavController, private settings: SettingsService) {
    this.disclaimer = settings.legalDisclaimer;
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("About");
    }
  }

  showContactAlert() {
    let alert = Alert.create({
      title: "Missing email client",
      message: "Contact us at puppy.box@outlook.com"
    });

    this.nav.present(alert);
  }

  openHomepage() {
    let url: string = "http://facebook.com/puppy.box.studio/";

    if (window.cordova) {
      window.cordova.InAppBrowser.open(url, "_system", "location=no");
    }
    else {
      window.open(url, "_blank");
    }
  }

  openContact() {
    if (window.cordova) {
      window.cordova.plugins.email.isAvailable(isAvailable => {
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
