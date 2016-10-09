import _ from "lodash";

export class CountryModel {
  id: string;
  name: string;

  constructor(json: Object) {
    this.id = _.get(json, "iso", "");
    this.name = _.get(json, "name", "");
  }

  getImageSource() {
    return "assets/data_common/flags/" + this.id + ".png";
  }
}
