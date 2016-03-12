import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {shuffle, filter, random} from "lodash";

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
        json.map(champJson => {
          let champion = new ChampionModel(champJson);

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

  getComponents(champion: ChampionModel) {
    let valid = this.getValidComponents(champion).slice(0, 5);
    let invalid = this.getInvalidComponents(champion);

    let components = valid.concat(invalid.slice(0, 12 - valid.length));
    return components;
  }

  getValidComponents(champion: ChampionModel) {
    return filter(this.skills, node => {
      return champion.skills.indexOf(node) !== -1;
    });
  }

  getInvalidComponents(champion: ChampionModel) {
    return filter(shuffle(this.skills), node => {
      return champion.skills.indexOf(node) === -1;
    });
  }
}

@Injectable()
export class SkillService {
  constructor(public championService: ChampionService) {
  }

  getChampion(skill: SkillModel) {
    return filter(this.championService.champions, node => {
      return node.id === skill.championId;
    })[0];
  }

  getAny() {
    let skills = this.championService.skills;
    let index = random(0, skills.length - 1);
    return skills[index];
  }

  getComponents(skill: SkillModel) {
    let valid = this.getValidComponents(skill);
    let invalid = this.getInvalidComponents(skill);

    let components = valid.concat(invalid.slice(0, 9 - valid.length));
    return components;
  }

  getValidComponents(skill: SkillModel) {
    return [this.getChampion(skill)];
  }

  getInvalidComponents(skill: SkillModel) {
    return filter(shuffle(this.championService.champions), node => {
      return node.id !== skill.championId;
    });
  }
}
