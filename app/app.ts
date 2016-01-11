import {HTTP_PROVIDERS} from 'angular2/http';
import {App, IonicApp, Platform} from 'ionic-framework/ionic';

import {GameTypeService} from './game/types/service';
import {ItemService} from './item/service';
import {ChampionService, SkillService} from './champion/service';
import {GameplayService} from './gameplay/service';
import {CountryService} from './country/service';
import {ScoreService} from './score/service';

import {MainMenuPage} from './main_menu/page';

@App({
  templateUrl: 'build/app.html',
  providers: [ItemService, ChampionService, SkillService, GameplayService, GameTypeService, CountryService, ScoreService, HTTP_PROVIDERS]
})
class MyApp {
  constructor(app: IonicApp, platform: Platform) {

    // set up our app
    this.app = app;
    this.platform = platform;
    this.root = MainMenuPage;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('Platform ready');

      if (typeof StatusBar !== 'undefined') {
        StatusBar.styleDefault();
      }
    });
  }
}
