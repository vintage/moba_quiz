import {Page, NavController, Alert} from "ionic-angular";

@Page({
  templateUrl: "build/pages/about/page.html",
})
export class AboutPage {
  constructor(public nav: NavController) {
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
