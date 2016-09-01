import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {random, uniq} from "lodash";

import {ChampionModel, SkillModel} from "./model";

@Injectable()
export class ChampionService {
  champions: ChampionModel[];
  skills: SkillModel[];
  private types: string[];
  private skillTypes: string[];
  private tags: string[];

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
        this.types = [];
        this.skillTypes = [];
        this.tags = [];

        let json = res.json();
        json.map(data => {
          let champion = new ChampionModel(data);

          if (champion.type) {
            this.types.push(champion.type);
          }
          this.tags = this.tags.concat(champion.tags);

          this.champions.push(champion);
          this.skills = this.skills.concat(champion.skills);
        });

        this.tags = uniq(this.tags);
        this.types = uniq(this.types);
        this.skillTypes = uniq(this.skills.map(skill => {
          return skill.type;
        }));

        console.log(this.champions);
        console.log(this.skills);
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

  supportAttackType() {
    return this.champions.filter(node => {
      return node.is_range !== null;
    }).length > 0;
  }

  supportType() {
    return this.types.length > 0;
  }

  supportTags() {
    return this.tags.length > 0;
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

  getTypes(): string[] {
    return this.types;
  }

  getTags(): string[] {
    return this.tags;
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
    let container = this.championService.champions.filter(ch => {
      let hasSameSkill = ch.skills.filter(s => {
        return s.id === skill.id;
      }).length > 0;

      return !hasSameSkill; 
    });

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
