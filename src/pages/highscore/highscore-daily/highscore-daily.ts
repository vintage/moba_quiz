import {Component} from "@angular/core";
import {Platform} from "ionic-angular";

import {ScoreService} from "../../../providers/score/service";
import {ScoreModel} from "../../../providers/score/model";

import {HighscoreGeneralPage} from "../highscore-general/highscore-general";

@Component({
  selector: 'page-highscore-daily',
  templateUrl: "highscore-daily.html",
})
export class HighscoreDailyPage extends HighscoreGeneralPage {
  constructor(public score: ScoreService, public platform: Platform) {
    super(score, platform);
  }

  getScores(): Promise<ScoreModel[]> {
    return this.score.getDaily();
  }
}