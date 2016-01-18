import {HTTP_PROVIDERS} from 'angular2/http';
import {App, IonicApp, Platform} from 'ionic-framework/ionic';

import {ItemService} from './providers/item/service';
import {ChampionService, SkillService} from './providers/champion/service';
import {GameplayService} from './providers/gameplay/service';
import {CountryService} from './providers/country/service';
import {ScoreService} from './providers/score/service';

import {MainMenuPage} from './pages/main_menu/page';

@App({
  templateUrl: 'build/app.html',
  providers: [ItemService, ChampionService, SkillService, GameplayService, CountryService, ScoreService, HTTP_PROVIDERS]
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
