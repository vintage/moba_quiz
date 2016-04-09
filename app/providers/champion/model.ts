import {get} from "lodash";

export class ChampionModel {
  id: string;
  name: string;
  is_range: boolean;
  skills: SkillModel[];
  private image: string;

  constructor(json: Object) {
    this.id = get(json, "id");
    this.name = get(json, "name");
    this.image = get(json, "image");
    this.is_range = get(json, "is_range");
    this.skills = [];

    let spells = get(json, "spells", []);
    for (let spell of spells) {
      this.skills.push(new SkillModel(spell, this.id));
    }
  }

  getImageSource() {
    return "data/images/champions/" + this.image[0];
  }

  getBigImage() {
    return "data/images/champions/" + this.image[1];
  }
}

export class SkillModel {
  id: string;
  name: string;
  championId: string;
  private image: string;

  constructor(json: Object, championId: string) {
    this.id = get(json, "id");
    this.name = get(json, "name");
    this.image = get(json, "image");
    this.championId = championId;
  }

  getImageSource() {
    return "data/images/champions/" + this.image;
  }
}
