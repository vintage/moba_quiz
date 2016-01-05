import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {shuffle, filter} from 'lodash';

import {ChampionModel, SkillModel} from './model';

@Injectable()
export class ChampionService {
    champions:ChampionModel[];
    skills:SkillModel[];

    constructor(http:Http) {
        this.http = http;
    }

    Initialize() {
        return this.http.get('data/champions.json')
            .subscribe(res => {
                json = res.json();
                this.champions = [];
                this.skills = [];
                json.map(champJson => {
                    let champion = new ChampionModel(champJson);

                    this.champions.push(champion);
                    this.skills = this.skills.concat(champion.skills);
                });
            });
    }

    GetAllRandom() {
        return shuffle(this.champions);
    }

    GetRandomSkills() {
        return shuffle(this.skills);
    }

    GetNext() {
        let champions = this.GetAllRandom();
        return champions[0];
    }

    GetComponents(champion:ChampionModel) {
        var valid = this.GetValidComponents(champion);
        var invalid = this.GetInvalidComponents(champion);

        var components = valid.concat(invalid.slice(0, 12 - valid.length));
        return shuffle(components);
    }

    GetValidComponents(champion:ChampionModel) {
        return filter(this.GetRandomSkills(), node => {
            return champion.skills.indexOf(node) != -1;
        });
    }

    GetInvalidComponents(champion:ChampionModel) {
        return filter(this.GetRandomSkills(), node => {
            return champion.skills.indexOf(node) == -1;
        });
    }
}

@Injectable()
export class SkillService {
    constructor(championService:ChampionService) {
        this.championService = championService;
    }

    GetChampion(skill:SkillModel) {
        return filter(this.GetRandomChampions(), node => {
            return node.id == skill.championId;
        })[0];
    }

    GetAllRandom() {
        return this.championService.GetRandomSkills();
    }

    GetRandomChampions() {
        return this.championService.GetAllRandom();
    }

    GetNext() {
        let skills = this.GetAllRandom();
        return skills[0];
    }

    GetComponents(skill:SkillModel) {
        var valid = this.GetValidComponents(skill);
        var invalid = this.GetInvalidComponents(skill);

        var components = valid.concat(invalid.slice(0, 6 - valid.length));
        return shuffle(components);
    }

    GetValidComponents(skill:SkillModel) {
        return [this.GetChampion(skill)];
    }

    GetInvalidComponents(skill:SkillModel) {
        return filter(this.GetRandomChampions(), node => {
            return node.id != skill.championId;
        });
    }
}