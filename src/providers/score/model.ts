import _ from "lodash";

export class ScoreModel {
  player: string;
  score: number;
  flag: string;
  platform: string;

  constructor(json: Object) {
    this.player = _.get(json, "player_name", "");
    this.score = parseInt(_.get(json, "value", "0"));
    this.flag = _.get(json, "country_code", "");
    this.platform = _.get(json, "platform", "");
  }

  getImageSource() {
    if (this.flag && this.flag.length === 2) {
      return "assets/data_common/flags/" + this.flag + ".png";
    } else {
      return "assets/data_common/flags/_unknown.png";
    }
  }

  getPlatformImage() {
    if (this.platform === "windows") {
      return "assets/data_common/platforms/windows.png";
    } else if (this.platform === "android") {
      return "assets/data_common/platforms/android.png";
    } else {
      return "assets/data_common/platforms/apple.png";
    }
  }
}
