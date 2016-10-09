import {Injectable} from "@angular/core";
import _ from "lodash";

import {ItemService} from "../item/service";
import {ChampionService} from "../champion/service";

import {GameTypeModel} from "./model";
import {ItemRecipeGame} from "../../components/game-types/item-recipe/item-recipe";
import {ItemPriceGame} from "../../components/game-types/item-price/item-price";
import {ChampionSkillsGame} from "../../components/game-types/champion-skills/champion-skills";
import {ChampionAttackTypeGame} from "../../components/game-types/champion-attack-type/champion-attack-type";
import {SkillChampionGame} from "../../components/game-types/skill-champion/skill-champion";
import {ChampionNameGame} from "../../components/game-types/champion-name/champion-name";
import {ChampionTitleGame} from "../../components/game-types/champion-title/champion-title";
import {ChampionNationGame} from "../../components/game-types/champion-nation/champion-nation";

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
      new GameTypeModel("item_price", ItemPriceGame),
      new GameTypeModel("champion_skills", ChampionSkillsGame),
      new GameTypeModel("champion_attack_type", ChampionAttackTypeGame),
      new GameTypeModel("skill_champion", SkillChampionGame),
      new GameTypeModel("champion_name", ChampionNameGame)
    ];

    if (this.items.supportRecipe()) {
      this.gameTypes.push(new GameTypeModel("item_recipe", ItemRecipeGame));
    }

    if (this.champions.supportTitle()) {
      this.gameTypes.push(new GameTypeModel("champion_title", ChampionTitleGame));
    }

    if (this.champions.supportNation()) {
      this.gameTypes.push(new GameTypeModel("champion_nation", ChampionNationGame));
    }
  }

  getAny() {
    return _.sample(this.gameTypes);
  }
}
