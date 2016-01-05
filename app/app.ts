import {HTTP_PROVIDERS} from 'angular2/http';
import {App, IonicApp, Platform} from 'ionic-framework/ionic';

import {GameTypeService} from './game/types/service';
import {GamePage} from './game/game';
import {ItemService} from './item/service';
import {ChampionService, SkillService} from './champion/service';
import {GameplayService} from './gameplay/service';


@App({
  templateUrl: 'build/app.html',
  providers: [ItemService, ChampionService, SkillService, GameplayService, GameTypeService, HTTP_PROVIDERS]
})
class MyApp {
  constructor(app: IonicApp, platform: Platform) {

    // set up our app
    this.app = app;
    this.platform = platform;
    this.game = GamePage;
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
