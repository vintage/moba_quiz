import {Injectable} from "@angular/core";
import {sample} from "lodash";

import {ItemService} from "../../../providers/item/service";
import {ChampionService} from "../../../providers/champion/service";

import {GameTypeModel} from "./model";
import {ItemRecipeGame} from "./item_recipe/component";
import {ItemPriceGame} from "./item_price/component";
import {ChampionSkillsGame} from "./champion_skills/component";
import {ChampionAttackTypeGame} from "./champion_attack_type/component";
import {SkillChampionGame} from "./skill_champion/component";
import {ChampionNameGame} from "./champion_name/component";
import {ChampionTitleGame} from "./champion_title/component";
import {ChampionTypeGame} from "./champion_type/component";
import {ChampionTagGame} from "./champion_tag/component";
import {TagChampionGame} from "./tag_champion/component";

@Injectable()
export class GameTypeService {
  private gameTypes: GameTypeModel[];

  constructor(
    private items: ItemService,
    private champions: ChampionService
  ) {

  }

  load() {
    this.gameTypes = [
     new GameTypeModel("champion_name", ChampionNameGame),
     new GameTypeModel("skill_champion", SkillChampionGame)
    ];
    
    if (this.champions.supportAttackType()) {
     this.gameTypes.push(new GameTypeModel("champion_attack_type", ChampionAttackTypeGame));
    }
    
    if (this.items.supportPrice()) {
     this.gameTypes.push(new GameTypeModel("item_price", ItemPriceGame));
    }
    
    if (this.items.supportRecipe()) {
     this.gameTypes.push(new GameTypeModel("item_recipe", ItemRecipeGame));
    }
    
    if (this.champions.supportTitle()) {
     this.gameTypes.push(new GameTypeModel("champion_title", ChampionTitleGame));
    }
    
    if (this.champions.supportType()) {
     this.gameTypes.push(new GameTypeModel("champion_type", ChampionTypeGame));
    }

    if (this.champions.supportTags()) {
      this.gameTypes.push(new GameTypeModel("tag_champion", TagChampionGame));
      this.gameTypes.push(new GameTypeModel("champion_tag", ChampionTagGame));
    }
  }

  getAny() {
    let type = sample(this.gameTypes);
    return type;
  }
}
