import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import _ from "lodash";

import { ChampionModel, SkillModel } from "./model";

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
      this.http.get("assets/data/champions.json").subscribe(res => {
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

  getAll() {
    return this.champions;
  }

  getAny() {
    let container = this.getAll();

    return _.sample(container);
  }

  getAnyWithAttackType() {
    let container = this.getAll().filter(c => {
      return c.is_range !== null;
    });

    return _.sample(container);
  }

  getValidComponents(champion: ChampionModel) {
    return this.skills.filter(s => {
      return s.championId === champion.id;
    });
  }

  getInvalidComponents(champion: ChampionModel, limit: number) {
    let container = this.skills.filter(s => {
      return s.championId !== champion.id;
    });

    return _.sampleSize(container, limit);
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

  getAll() {
    return this.championService.skills;
  }

  getAny() {
    let container = this.getAll();

    return _.sample(container);
  }

  getValidComponents(skill: SkillModel) {
    return [this.getChampion(skill)];
  }

  getInvalidComponents(skill: SkillModel, limit: number) {
    let container = this.championService.champions.filter(c => {
      return c.id !== skill.championId;
    });

    return _.sampleSize(container, limit);
  }
}
