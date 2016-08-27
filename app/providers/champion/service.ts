import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {random} from "lodash";

import {ChampionModel, SkillModel} from "./model";

@Injectable()
export class ChampionService {
  champions: ChampionModel[];
  skills: SkillModel[];
  private nations: string[];

  constructor(public http: Http) {
  }

  load() {
    if (this.champions && this.skills) {
      return Promise.resolve([this.champions, this.skills]);
    }

    return new Promise(resolve => {
      this.http.get("data/champions.json").subscribe(res => {
        this.champions = [];
        this.skills = [];
        this.nations = [];

        let json = res.json();
        json.map(data => {
          let champion = new ChampionModel(data);

          if (champion.nation && this.nations.indexOf(champion.nation) === -1) {
            this.nations.push(champion.nation);
          }

          this.champions.push(champion);
          this.skills = this.skills.concat(champion.skills);
        });

        resolve([this.champions, this.skills]);
      });
    });
  }

  getAny() {
    let champions = this.champions;
    let index = random(0, champions.length - 1);
    return champions[index];
  }

  supportTitle() {
    return this.champions.filter(node => {
      return !!node.title && node.title.length > 0;
    }).length > 0;
  }

  supportNation() {
    return this.champions.filter(node => {
      return !!node.nation && node.nation.length > 0;
    }).length > 0;
  }

  getAnyWithAttackType() {
    let champion = this.getAny();
    while (champion.is_range === null) {
      champion = this.getAny();
    }

    return champion;
  }

  getValidComponents(champion: ChampionModel) {
    return this.skills.filter(node => {
      return champion.skills.indexOf(node) !== -1;
    });
  }

  getInvalidComponents(champion: ChampionModel, limit: number) {
    let result: SkillModel[] = [];
    let container = this.skills;

    while (result.length < limit) {
      let index = random(0, container.length - 1);
      let node = container[index];

      if (champion.skills.indexOf(node) === -1 && result.indexOf(node) === -1) {
        result.push(node);
      }
    }

    return result;
  }

  getNations(): string[] {
    return this.nations;
  }
}

@Injectable()
export class SkillService {
  constructor(public championService: ChampionService) {
  }

  getChampion(skill: SkillModel) {
    return this.championService.champions.filter(node => {
      return node.id === skill.championId;
    })[0];
  }

  getAny() {
    let skills = this.championService.skills;
    let index = random(0, skills.length - 1);
    return skills[index];
  }

  getValidComponents(skill: SkillModel) {
    return [this.getChampion(skill)];
  }

  getInvalidComponents(skill: SkillModel, limit: number) {
    let result: ChampionModel[] = [];
    let container = this.championService.champions;

    while (result.length < limit) {
      let index = random(0, container.length - 1);
      let node = container[index];

      if (node.id !== skill.championId && result.indexOf(node) === -1) {
        result.push(node);
      }
    }

    return result;
  }
}
