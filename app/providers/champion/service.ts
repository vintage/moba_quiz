import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {random} from "lodash";

import {ChampionModel, SkillModel} from "./model";

@Injectable()
export class ChampionService {
  champions: ChampionModel[];
  skills: SkillModel[];

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

        let json = res.json();
        json.map(data => {
          let champion = new ChampionModel(data);

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
