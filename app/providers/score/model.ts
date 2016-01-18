export class ScoreModel {
    public player: string;
    public score: string;
    public extraData: Object;

    constructor(player:string, score:string) {
      this.player = player;
      this.score = score;
    }

    getImageSource() {
      return "img/flags/" + "PL" + ".png";
    }
}
