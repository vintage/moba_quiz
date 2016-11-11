import _ from "lodash";

export class ItemModel {
  id: string;
  name: string;
  nameI18n: Object;
  from: string[];
  into: string[];
  price: number;
  private image: string;

  constructor(json: Object) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.nameI18n = _.get(json, "name_i18n", {});
    this.from = _.get(json, "from", []);
    this.into = _.get(json, "into", []);
    this.price = _.get(json, "price", 0);
    this.image = _.get(json, "image", "");
  }

  getImageSource() {
    return "assets/data/images/items/" + this.image;
  }

  getName(language: string): string {
    if (!language || !this.nameI18n.hasOwnProperty(language)) {
      return this.name;
    }

    return this.nameI18n[language];
  }
}
