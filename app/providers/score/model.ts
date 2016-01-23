export class ScoreModel {
  public player: string;
  public score: string;
  public flag: string;

  constructor(player: string, score: string, flag: string) {
    this.player = player;
    this.score = parseInt(score.toString());
    this.flag = flag;
  }

  getImageSource() {
    if(this.flag && this.flag.length == 2) {
      return "img/flags/" + this.flag + ".png";
    }
    else {
      return "img/flags/_unknown.png";
    }
  }
}
