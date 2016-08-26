import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AppVersion} from "ionic-native";

import {AboutPage} from "../about/page";
import {SettingsService} from "../../providers/settings/service";

@Component({
  templateUrl: "build/pages/settings/page.html",
})
export class SettingsPage implements OnInit {
  public isMusic: boolean = true;
  public isVibration: boolean = true;
  public appVersion: string;
  public appName: string;

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    public settings: SettingsService) {
    
  }

  ngOnInit() {
    AppVersion.getVersionNumber().then(version => {
      this.appVersion = version;
    }).catch(() => {
      this.appVersion = "1.0.0";
    });

    AppVersion.getAppName().then(name => {
      this.appName = name;
    }).catch(() => {
      this.appName = "Application";
    });
    
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
