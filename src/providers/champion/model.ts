import _ from "lodash";

export class ChampionModel {
  id: string;
  name: string;
  nameI18n: Object;
  title: string;
  titleI18n: Object;
  nation: string;
  is_range: boolean;
  skills: SkillModel[];
  private image: string;

  constructor(json: Object) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.nameI18n = _.get(json, "name_i18n", {});
    this.title = _.get(json, "title", "");
    this.titleI18n = _.get(json, "title_i18n", {});
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

  getName(language: string): string {
    if (!language || !this.nameI18n.hasOwnProperty(language)) {
      return this.name;
    }

    return this.nameI18n[language];
  }

  getTitle(language: string): string {
    if (!language || !this.titleI18n.hasOwnProperty(language)) {
      return this.title;
    }

    return this.titleI18n[language];
  }
}

export class SkillModel {
  id: string;
  name: string;
  nameI18n: Object;
  championId: string;
  private image: string;

  constructor(json: Object, championId: string) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.nameI18n = _.get(json, "name_i18n", {});
    this.image = _.get(json, "image", "");
    this.championId = championId;
  }

  getImageSource() {
    return "assets/data/images/champions/" + this.image;
  }

  getName(language: string): string {
    if (!language || !this.nameI18n.hasOwnProperty(language)) {
      return this.name;
    }

    return this.nameI18n[language];
  }
}
