import {get} from 'lodash';

export class ScoreModel {
  public player: string;
  public score: number;
  public flag: string;
  public platform: string;

  constructor(json: Object) {
    this.player = get(json, "player_name");
    this.score = parseInt(get(json, "value"));
    this.flag = get(json, "country_code");
    this.platform = get(json, "platform");
  }

  getImageSource() {
    if (this.flag && this.flag.length === 2) {
      return "img/flags/" + this.flag + ".png";
    }
    else {
      return "img/flags/_unknown.png";
    }
  }
}
