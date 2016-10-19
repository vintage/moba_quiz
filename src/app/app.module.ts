import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { AchievementListPage } from '../pages/achievement-list/achievement-list';
import { CountryListPage } from '../pages/country-list/country-list';
import { HighscorePage } from '../pages/highscore/highscore';
import { HighscoreGeneralPage } from '../pages/highscore/highscore-general/highscore-general';
import { HighscoreMonthlyPage } from '../pages/highscore/highscore-monthly/highscore-monthly';
import { HighscoreDailyPage } from '../pages/highscore/highscore-daily/highscore-daily';
import { HighscoreHardcorePage } from '../pages/highscore/highscore-hardcore/highscore-hardcore';
import { MainMenuPage } from '../pages/main-menu/main-menu';
import { ScoreSubmitPage } from '../pages/score-submit/score-submit';
import { SettingsPage } from '../pages/settings/settings';
import { ShopPage } from '../pages/shop/shop';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { GamePage } from '../pages/game/game';
import { GameHardcorePage } from '../pages/game-hardcore/game-hardcore';

// Components
import { AnswerButton } from '../components/answer-button/answer-button';
import { GameSlot } from '../components/game-slot/game-slot';
import { GameStats } from '../components/game-stats/game-stats';

// Components (game types)
import { ItemRecipeGame } from "../components/game-types/item-recipe/item-recipe";
import { ItemPriceGame } from "../components/game-types/item-price/item-price";
import { ChampionSkillsGame } from "../components/game-types/champion-skills/champion-skills";
import { ChampionAttackTypeGame } from "../components/game-types/champion-attack-type/champion-attack-type";
import { SkillChampionGame } from "../components/game-types/skill-champion/skill-champion";
import { ChampionNameGame } from "../components/game-types/champion-name/champion-name";
import { ChampionTitleGame } from "../components/game-types/champion-title/champion-title";
import { ChampionNationGame } from "../components/game-types/champion-nation/champion-nation";

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

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
};

@NgModule({
  declarations: [
    MyApp,

    // Pages
    AboutPage,
    AchievementListPage,
    CountryListPage,
    HighscorePage,
    HighscoreGeneralPage,
    HighscoreMonthlyPage,
    HighscoreDailyPage,
    HighscoreHardcorePage,
    MainMenuPage,
    ScoreSubmitPage,
    SettingsPage,
    ShopPage,
    TutorialPage,
    GamePage,
    GameHardcorePage,

    // Pipes
    PointsPipe,
    TimeLeftPipe,

    // Components
    AnswerButton,
    GameSlot,
    GameStats,

    // Components (game types)
    ItemRecipeGame,
    ItemPriceGame,
    ChampionSkillsGame,
    ChampionAttackTypeGame,
    SkillChampionGame,
    ChampionNameGame,
    ChampionTitleGame,
    ChampionNationGame
  ],
  imports: [
    IonicModule.forRoot(MyApp, appConfig),
    HttpModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
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
    HighscoreDailyPage,
    HighscoreHardcorePage,
    MainMenuPage,
    ScoreSubmitPage,
    SettingsPage,
    ShopPage,
    TutorialPage,
    GamePage,
    GameHardcorePage,

    // Game types
    ItemRecipeGame,
    ItemPriceGame,
    ChampionSkillsGame,
    ChampionAttackTypeGame,
    SkillChampionGame,
    ChampionNameGame,
    ChampionTitleGame,
    ChampionNationGame
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
