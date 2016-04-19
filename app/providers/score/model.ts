import {get} from "lodash";

export class ScoreModel {
  player: string;
  score: number;
  flag: string;
  platform: string;

  constructor(json: Object) {
    this.player = get(json, "player_name");
    this.score = parseInt(get(json, "value"));
    this.flag = get(json, "country_code");
    this.platform = get(json, "platform");
  }

  getImageSource() {
    if (this.flag && this.flag.length === 2) {
      return "data_common/flags/" + this.flag + ".png";
    }
    else {
      return "data_common/flags/_unknown.png";
    }
  }
}
