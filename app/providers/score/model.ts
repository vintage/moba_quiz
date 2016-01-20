export class ScoreModel {
  public player: string;
  public score: string;
  public flag: string;

  constructor(player: string, score: string, flag: string) {
    this.player = player;
    this.score = score;
    this.flag = flag.substring(0, 2);
  }

  getImageSource() {
    return "img/flags/" + this.flag + ".png";
  }
}
