import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { AchievementListPage } from '../pages/achievement-list/achievement-list';
import { CountryListPage } from '../pages/country-list/country-list';
import {
  HighscorePage,
  HighscoreGeneralPage,
  HighscoreMonthlyPage,
  HighscoreWeeklyPage,
  HighscoreDailyPage
} from '../pages/highscore/highscore';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { ScoreSubmitPage } from '../pages/score-submit/score-submit';
import { SettingsPage } from '../pages/settings/settings';
import { ShopPage } from '../pages/shop/shop';
import { TutorialPage } from '../pages/tutorial/tutorial';

// Components

// Pipes
import { PointsPipe } from '../pipes/points';
import { TimeLeftPipe } from '../pipes/time-left';

// Services
import { AchievementService } from '../providers/achievement/service';
import { AdService } from '../providers/ads/service';
import { ChampionService, SkillService } from '../providers/champion/service';
import { CountryService } from '../providers/country/service';
import { GameplayService } from '../providers/gameplay/service';
import { ItemService } from '../providers/item/service';
import { MusicService } from '../providers/music/service';
import { ScoreService } from '../providers/score/service';
import { SettingsService } from '../providers/settings/service';
import { ShopService } from '../providers/shop/service';
import { GameTypeService } from '../providers/game-type/service';

let appConfig = {
  statusbarPadding: false,
  prodMode: true
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AchievementListPage,
    CountryListPage,
    HighscorePage,
    HighscoreGeneralPage,
    HighscoreMonthlyPage,
    HighscoreWeeklyPage,
    HighscoreDailyPage,
    MainMenuPage,
    ScoreSubmitPage,
    SettingsPage,
    ShopPage,
    TutorialPage,
    PointsPipe,
    TimeLeftPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp, appConfig),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AchievementListPage,
    CountryListPage,
    HighscorePage,
    HighscoreGeneralPage,
    HighscoreMonthlyPage,
    HighscoreWeeklyPage,
    HighscoreDailyPage,
    MainMenuPage,
    ScoreSubmitPage,
    SettingsPage,
    ShopPage,
    TutorialPage
  ],
  providers: [
    Storage,
    AchievementService,
    AdService,
    ChampionService,
    SkillService,
    CountryService,
    GameplayService,
    ItemService,
    MusicService,
    ScoreService,
    SettingsService,
    ShopService,
    GameTypeService
  ]
})
export class AppModule {}
