import {get} from "lodash";

export class CountryModel {
  id: string;
  name: string;

  constructor(json: Object) {
    this.id = get(json, "iso");
    this.name = get(json, "name");
  }

  getImageSource() {
    return "data/images/flags/" + this.id + ".png";
  }
}
