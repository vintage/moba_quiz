import {get} from "lodash";

export class CountryModel {
  id: string;
  name: string;

  constructor(json: Object) {
    this.id = get(json, "iso");
    this.name = get(json, "name");
  }

  getImageSource() {
    return "img/flags/" + this.id + ".png";
  }
}
