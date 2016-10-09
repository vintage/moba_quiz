import {Injectable} from "@angular/core";
import _ from "lodash";

import {ItemService} from "../item/service";
import {ChampionService} from "../champion/service";

import {GameTypeModel} from "./model";
// import {ItemRecipeGame} from "./item_recipe/component";
// import {ItemPriceGame} from "./item_price/component";
// import {ChampionSkillsGame} from "./champion_skills/component";
// import {ChampionAttackTypeGame} from "./champion_attack_type/component";
// import {SkillChampionGame} from "./skill_champion/component";
// import {ChampionNameGame} from "./champion_name/component";
// import {ChampionTitleGame} from "./champion_title/component";
// import {ChampionNationGame} from "./champion_nation/component";

@Injectable()
export class GameTypeService {
  private gameTypes: GameTypeModel[];

  constructor(
    private items: ItemService,
    private champions: ChampionService
  ) {

  }

  load() {
    // this.gameTypes = [
    //   new GameTypeModel("item_price", ItemPriceGame),
    //   new GameTypeModel("champion_skills", ChampionSkillsGame),
    //   new GameTypeModel("champion_attack_type", ChampionAttackTypeGame),
    //   new GameTypeModel("skill_champion", SkillChampionGame),
    //   new GameTypeModel("champion_name", ChampionNameGame)
    // ];

    // if (this.items.supportRecipe()) {
    //   this.gameTypes.push(new GameTypeModel("item_recipe", ItemRecipeGame));
    // }

    // if (this.champions.supportTitle()) {
    //   this.gameTypes.push(new GameTypeModel("champion_title", ChampionTitleGame));
    // }

    // if (this.champions.supportNation()) {
    //   this.gameTypes.push(new GameTypeModel("champion_nation", ChampionNationGame));
    // }
  }

  getAny() {
    return _.sample(this.gameTypes);
  }
}
