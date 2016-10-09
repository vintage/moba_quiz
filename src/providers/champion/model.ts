import _ from "lodash";

export class ChampionModel {
  id: string;
  name: string;
  title: string;
  nation: string;
  is_range: boolean;
  skills: SkillModel[];
  private image: string;

  constructor(json: Object) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.title = _.get(json, "title", "");
    this.nation = _.get(json, "nation", "");
    this.image = _.get(json, "image", "");
    this.is_range = _.get(json, "is_range", null);
    this.skills = [];

    let spells = _.get(json, "spells", []);
    for (let spell of spells) {
      this.skills.push(new SkillModel(spell, this.id));
    }
  }

  getImageSource() {
    return "assets/data/images/champions/" + this.image;
  }
}

export class SkillModel {
  id: string;
  name: string;
  championId: string;
  private image: string;

  constructor(json: Object, championId: string) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.image = _.get(json, "image", "");
    this.championId = championId;
  }

  getImageSource() {
    return "assets/data/images/champions/" + this.image;
  }
}
