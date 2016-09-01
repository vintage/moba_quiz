import {get} from "lodash";

export class ChampionModel {
  id: string;
  name: string;
  title: string;
  type: string;
  is_range: boolean;
  tags: string[];
  skills: SkillModel[];
  image: string;

  constructor(json: Object) {
    this.id = get(json, "id", "");
    this.name = get(json, "name", "");
    this.title = get(json, "title", "");
    this.type = get(json, "type", "");
    this.image = get(json, "image", "");
    this.is_range = get(json, "is_range", null);
    this.tags = get(json, "tags", []);
    this.skills = [];

    let skills = get(json, "skills", []);
    for (let skill of skills) {
      this.skills.push(new SkillModel(skill, this.id));
    }
  }

  getImageSource() {
    return "data/images/champions/" + this.image;
  }
}

export class SkillModel {
  id: string;
  name: string;
  type: string;
  value: string;
  championId: string;

  image: string;

  constructor(json: Object, championId: string) {
    this.id = get(json, "id", "");
    this.name = get(json, "name", "");
    this.type = get(json, "type", "");
    this.value = get(json, "value", "");
    this.image = get(json, "image", "");
    this.championId = championId;
  }

  getImageSource() {
    return "data/images/champions/" + this.image;
  }
}
