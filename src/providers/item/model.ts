import _ from "lodash";

export class ItemModel {
  id: string;
  name: string;
  from: string[];
  into: string[];
  price: number;
  private image: string;

  constructor(json: Object) {
    this.id = _.get(json, "id", "");
    this.name = _.get(json, "name", "");
    this.from = _.get(json, "from", []);
    this.into = _.get(json, "into", []);
    this.price = _.get(json, "price", 0);
    this.image = _.get(json, "image", "");
  }

  getImageSource() {
    return "assets/data/images/items/" + this.image;
  }
}
