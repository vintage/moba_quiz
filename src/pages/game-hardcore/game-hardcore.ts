import {Component} from "@angular/core";
import {NavController, ViewController, AlertController} from "ionic-angular";
import {ComponentFactoryResolver, Compiler, ViewContainerRef, ViewChild} from "@angular/core";

import {ItemService} from "../../providers/item/service";
import {ChampionService} from "../../providers/champion/service";
import {GameplayService} from "../../providers/gameplay/service";
import {AdService} from "../../providers/ads/service";
import {AchievementService} from "../../providers/achievement/service";
import {SettingsService} from "../../providers/settings/service";
import {ShopService} from "../../providers/shop/service";
import {GameTypeService} from "../../providers/game-type/service";
import {MusicService} from "../../providers/music/service";
import {TranslateService} from 'ng2-translate/ng2-translate';

import { GamePage } from "../game/game";
import { ScoreSubmitPage } from "../score-submit/score-submit";

@Component({
  selector: 'page-game-hardcore',
  templateUrl: 'game-hardcore.html'
})
export class GameHardcorePage extends GamePage {
  @ViewChild("gameType", {read: ViewContainerRef}) currentLevel: ViewContainerRef;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      public componentFactoryResolver: ComponentFactoryResolver,
      public compiler: Compiler,
      public alertCtrl: AlertController,
      public translate: TranslateService,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypes: GameTypeService,
      public ads: AdService,
      public settings: SettingsService,
      public achievements: AchievementService,
      public shop: ShopService,
      public music: MusicService
  ) {
    super(nav, viewCtrl, componentFactoryResolver, compiler, alertCtrl, translate, gameplay,
    itemService, championService, gameTypes, ads, settings, achievements, shop, music);
  }

  startGame() {
    super.startGame();

    this.gameplay.chances = 1;
  }

   // Do nothing - hardcore mode is just hardcore
  addExtraLife(count: number) {}
  addExtraSkips(count: number) {}
  removeExtraLife() {}

  isCoinLevel(): boolean {
    // Every level is a coin level
    return true;
  }

  getCoinsAmount(): number {
    return 15;
  }

  openScoreSubmit() {
    this.nav.push(ScoreSubmitPage, {'isHardcore': true}).then(() => {
      this.nav.remove(this.nav.indexOf(this.viewCtrl)).then(() => {
        if (this.showAd) {
          this.ads.showFullScreen();
        }
      });
    });
  }
}
