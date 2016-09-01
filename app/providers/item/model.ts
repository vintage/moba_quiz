import {get} from "lodash";

export class ItemModel {
  id: string;
  name: string;
  from: string[];
  into: string[];
  price: number;
  image: string;

  constructor(json: Object) {
    this.id = get(json, "id", "");
    this.name = get(json, "name", "");
    this.from = get(json, "from", []);
    this.into = get(json, "into", []);
    this.price = get(json, "price", 0);
    this.image = get(json, "image", "");
  }

  getImageSource() {
    return "data/images/items/" + this.image;
  }
}
