import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AppVersion} from 'ionic-native';
import {TranslateService} from 'ng2-translate/ng2-translate';

import {AboutPage} from '../about/about';
import {SettingsService} from '../../providers/settings/service';
import {MusicService} from '../../providers/music/service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public isMusic: boolean = true;
  public isVibration: boolean = true;
  public isSound: boolean = true;
  public appVersion: string;
  public currentLanguage: string;
  public languages: Object[];

  constructor(
    public nav: NavController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public settings: SettingsService,
    public music: MusicService) {
      this.languages = [
        {'code': 'de', 'name': 'Deutsch'},
        {'code': 'nl', 'name': 'Dutch'},
        {'code': 'en', 'name': 'English'},
        {'code': 'fr', 'name': 'French'},
        {'code': 'hu', 'name': 'Hungarian'},
        {'code': 'it', 'name': 'Italian'},
        {'code': 'pl', 'name': 'Polish'},
        {'code': 'pt', 'name': 'Portuguese'},
        {'code': 'ru', 'name': 'Russian'},
        {'code': 'es', 'name': 'Spanish'},
        {'code': 'tr', 'name': 'Turkish'},
      ];
  }

  ionViewDidEnter() {
    if (window['analytics']) {
      window['analytics'].trackView('Settings');
    }
  }

  ionViewWillEnter() {
    AppVersion.getVersionNumber().then(version => {
      this.appVersion = version;
    }).catch(() => {
      this.appVersion = '1.0.0';
    });
    
    this.settings.isMusicEnabled().then(v => this.isMusic = v);
    this.settings.isSoundEnabled().then(v => this.isSound = v);
    this.settings.isVibrationEnabled().then(v => this.isVibration = v);
    this.settings.getLanguage().then(v => this.currentLanguage = v || 'en');
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

  changeSound(event: any) {
    let isEnabled = event.checked;
    this.settings.setSound(isEnabled);
  }

  changeVibration(event: any) {
    let isEnabled = event.checked;
    this.settings.setVibration(isEnabled);
  }

  changeLanguage(event: any) {
    this.settings.setLanguage(this.currentLanguage);
    this.translate.use(this.currentLanguage);
  }
}
