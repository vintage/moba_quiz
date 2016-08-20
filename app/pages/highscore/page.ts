import {Component, OnInit} from "@angular/core";
import {Button, NavController, Platform} from "ionic-angular";

import {ScoreService} from "../../providers/score/service";
import {ScoreModel} from "../../providers/score/model";
import {PointsPipe} from "../../pipes/numbers";

@Component({
  templateUrl: "build/pages/highscore/highscore_list.html",
  pipes: [PointsPipe]
})
class HighscoreGeneralPage implements OnInit {
  title: string;
  scores: ScoreModel[];
  isOnline: boolean;

  constructor(public score: ScoreService, public platform: Platform) {
  }

  ngOnInit() {
    this.title = this.getTitle();
    this.isOnline = true;

    if (window['navigator']['connection'] && window['navigator']['connection']['type'] === window['Connection']['NONE']) {
      this.isOnline = false;
    } else {
      this.getScores().then(scores => {
        this.scores = scores;
      });
    }
  }

  getScores() {
    return this.score.getAll();
  }

  getTitle() {
    return "General";
  }

  getScorePlatformImage(score: ScoreModel) {
    if (this.platform.is("ios") && score.platform !== "apple") {
      return "data_common/platforms/unknown.png";
    }

    return score.getPlatformImage();
  }
}

@Component({
  templateUrl: "build/pages/highscore/highscore_list.html",
  pipes: [PointsPipe]
})
class HighscoreMonthlyPage extends HighscoreGeneralPage {
  constructor(public score: ScoreService, public platform: Platform) {
    super(score, platform);
  }

  getScores() {
    return this.score.getMonthly();
  }

  getTitle() {
    return "Monthly";
  }
}

@Component({
  templateUrl: "build/pages/highscore/highscore_list.html",
  pipes: [PointsPipe]
})
class HighscoreWeeklyPage extends HighscoreGeneralPage {
  constructor(public score: ScoreService, public platform: Platform) {
    super(score, platform);
  }

  getScores() {
    return this.score.getWeekly();
  }

  getTitle() {
    return "Weekly";
  }
}

@Component({
  templateUrl: "build/pages/highscore/highscore_list.html",
  pipes: [PointsPipe]
})
class HighscoreDailyPage extends HighscoreGeneralPage {
  constructor(public score: ScoreService, public platform: Platform) {
    super(score, platform);
  }

  getScores() {
    return this.score.getDaily();
  }

  getTitle() {
    return "Daily";
  }
}

@Component({
  templateUrl: "build/pages/highscore/page.html",
  directives: [Button]
})
export class HighscorePage {
  dailyTab: any;
  weeklyTab: any;
  monthlyTab: any;
  generalTab: any;

  constructor(
      public nav: NavController,
      public scoreService: ScoreService,
      public platform: Platform) {
    this.nav = nav;
    this.platform = platform;
    this.scoreService = scoreService;

    this.dailyTab = HighscoreDailyPage;
    this.weeklyTab = HighscoreWeeklyPage;
    this.monthlyTab = HighscoreMonthlyPage;
    this.generalTab = HighscoreGeneralPage;
  }

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Highscore");
    }
  }
}
