import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {AppVersion} from "ionic-native";

import {AboutPage} from "../about/about";
import {SettingsService} from "../../providers/settings/service";
import {MusicService} from "../../providers/music/service";

@Component({
  selector: 'page-settings',
  templateUrl: "settings.html",
})
export class SettingsPage {
  public isMusic: boolean = true;
  public isVibration: boolean = true;
  public appVersion: string;

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    public settings: SettingsService,
    public music: MusicService) {
    
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Settings");
    }
  }

  ionViewWillEnter() {
    AppVersion.getVersionNumber().then(version => {
      this.appVersion = version;
    }).catch(() => {
      this.appVersion = "1.0.0";
    });
    
    this.settings.isMusicEnabled().then(isEnabled => {
      this.isMusic = isEnabled;
    });

    this.settings.isVibrationEnabled().then(isEnabled => {
      this.isVibration = isEnabled;
    });
  }

  openAbout() {
    this.nav.push(AboutPage);
  }

  changeMusic(event: any) {
    let isEnabled = event.checked;
    this.settings.setMusic(isEnabled).then(() => {
      if (isEnabled) {
        this.music.enable();
      } else {
        this.music.disable();
      }
    });
  }

  changeVibration(event: any) {
    let isEnabled = event.checked;
    this.settings.setVibration(isEnabled);
  }
}
