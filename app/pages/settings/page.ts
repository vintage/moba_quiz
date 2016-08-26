import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";

import {AboutPage} from "../about/page";
import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/settings/page.html",
})
export class SettingsPage implements OnInit {
  public isMusic: boolean = true;
  public isVibration: boolean = true;

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    public settings: SettingsService) {
    
  }

  ngOnInit() {
    this.settings.isMusicEnabled().then(isEnabled => {
      this.isMusic = isEnabled;
    });

    this.settings.isVibrationEnabled().then(isEnabled => {
      this.isVibration = isEnabled;
    });
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Settings");
    }
  }

  openAbout() {
    this.nav.push(AboutPage);
  }

  changeMusic(event: any) {
    let isEnabled = event.checked;
    this.settings.setMusic(isEnabled);
  }

  changeVibration(event: any) {
    let isEnabled = event.checked;
    this.settings.setVibration(isEnabled);
  }
}
