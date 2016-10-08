import {get} from "lodash";

export class ScoreModel {
  player: string;
  score: number;
  flag: string;
  platform: string;

  constructor(json: Object) {
    this.player = get(json, "player_name", "");
    this.score = parseInt(get(json, "value", "0"));
    this.flag = get(json, "country_code", "");
    this.platform = get(json, "platform", "");
  }

  getImageSource() {
    if (this.flag && this.flag.length === 2) {
      return "data_common/flags/" + this.flag + ".png";
    } else {
      return "data_common/flags/_unknown.png";
    }
  }

  getPlatformImage() {
    if (this.platform === "windows") {
      return "data_common/platforms/windows.png";
    } else if (this.platform === "android") {
      return "data_common/platforms/android.png";
    } else {
      return "data_common/platforms/apple.png";
    }
  }
}
