import {get} from "lodash";

export class ItemModel {
  id: string;
  name: string;
  from: ItemModel[];
  into: ItemModel[];
  price: number;
  private image: string;

  constructor(json: Object) {
    this.id = get(json, "id");
    this.name = get(json, "name");
    this.from = get(json, "from", []);
    this.into = get(json, "into", []);
    this.price = get(json, "price");
    this.image = get(json, "image");
  }

  getImageSource() {
    return "data/images/items/" + this.image;
  }
}
