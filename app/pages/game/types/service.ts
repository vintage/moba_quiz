import {Injectable} from "angular2/core";
import {sample} from "lodash";

import {GameTypeModel} from "./model";
import {ItemRecipeGame} from "./item_recipe/component";
import {ItemPriceGame} from "./item_price/component";
import {ChampionSkillsGame} from "./champion_skills/component";
import {ChampionAttackTypeGame} from "./champion_attack_type/component";
import {SkillChampionGame} from "./skill_champion/component";

@Injectable()
export class GameTypeService {
  private gameTypes: GameTypeModel[];

  constructor() {
    this.gameTypes = [
      new GameTypeModel("item_recipe", ItemRecipeGame),
      new GameTypeModel("item_price", ItemPriceGame),
      new GameTypeModel("champion_skills", ChampionSkillsGame),
      new GameTypeModel("champion_attack_type", ChampionAttackTypeGame),
      new GameTypeModel("skill_champion", SkillChampionGame)
    ];
  }

  getAny() {
    return sample(this.gameTypes);
  }
}
