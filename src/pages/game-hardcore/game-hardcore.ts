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

import { GamePage } from "../game/game";
import { ScoreSubmitPage } from "../score-submit/score-submit";

@Component({
  selector: 'page-game-hardcore',
  templateUrl: "game-hardcore.html",
  inputs: ["question"]
})
export class GameHardcorePage extends GamePage {
  @ViewChild("gameType", {read: ViewContainerRef}) typeContainer: ViewContainerRef;

  constructor(
      public nav: NavController,
      public viewCtrl: ViewController,
      private componentFactoryResolver: ComponentFactoryResolver,
      private compiler: Compiler,
      private alertCtrl: AlertController,
      public gameplay: GameplayService,
      public itemService: ItemService,
      public championService: ChampionService,
      public gameTypes: GameTypeService,
      public ads: AdService,
      private settings: SettingsService,
      public achievements: AchievementService,
      private shop: ShopService
  ) {
    super(nav, viewCtrl, componentFactoryResolver, compiler, alertCtrl, gameplay,
    itemService, championService, gameTypes, ads, settings, achievements, shop);
  }

  addExtraLife(count: number) {
    // Do nothing - hardcore mode is just hardcore 
  }

  addExtraSkips(count: number) {
    // Do nothing - hardcore mode is just hardcore
  }

  isCoinLevel(): boolean {
    // Every level is a coin level
    return true;
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
