import {Component} from "@angular/core";
import {Platform} from "ionic-angular";

import {ScoreService} from "../../../providers/score/service";
import {ScoreModel} from "../../../providers/score/model";

@Component({
  selector: 'page-highscore-general',
  templateUrl: "highscore-general.html",
})
export class HighscoreGeneralPage {
  title: string;
  scores: ScoreModel[];
  isOnline: boolean;

  constructor(public score: ScoreService, public platform: Platform) {
  }

  ionViewWillEnter() {
    this.isOnline = true;

    if (window['navigator']['connection'] && window['navigator']['connection']['type'] === window['Connection']['NONE']) {
      this.isOnline = false;
    } else {
      this.getScores().then(scores => {
        this.scores = scores;
        if (scores === null) {
          this.isOnline = false;
        }
      });
    }
  }

  getScores(): Promise<ScoreModel[]> {
    return this.score.getAll();
  }

  getScorePlatformImage(score: ScoreModel) {
    if (this.platform.is("ios") && score.platform !== "apple") {
      return "assets/data_common/platforms/unknown.png";
    }

    return score.getPlatformImage();
  }
}