import {OnInit} from "angular2/core";
import {Button, Page, NavController, Platform} from "ionic-angular";

import {ScoreService} from "../../providers/score/service";
import {ScoreModel} from "../../providers/score/model";

@Page({
  templateUrl: "build/pages/highscore/highscore_list.html",
})
class HighscoreGeneralPage implements OnInit {
  title: string;
  scores: ScoreModel[];
  score: ScoreService;
  platform: Platform;
  isOnline: boolean;

  constructor(scoreService: ScoreService, platform: Platform) {
    this.score = scoreService;
    this.platform = platform;
  }

  ngOnInit() {
    this.title = this.getTitle();
    this.isOnline = true;

    this.platform.ready().then(() => {
      if (window.navigator.connection && window.navigator.connection.type === window.Connection.NONE) {
        this.isOnline = false;
      }
      else {
        this.getScores().then(scores => {
          this.scores = scores;
        });
      }
    });
  }

  getScores() {
    return this.score.getAll();
  }

  getTitle() {
    return "General";
  }
}

@Page({
  templateUrl: "build/pages/highscore/highscore_list.html",
})
class HighscoreMonthlyPage extends HighscoreGeneralPage {
  constructor(scoreService: ScoreService, platform: Platform) {
    super(scoreService, platform);
  }

  getScores() {
    return this.score.getMonthly();
  }

  getTitle() {
    return "Monthly";
  }
}

@Page({
  templateUrl: "build/pages/highscore/highscore_list.html",
})
class HighscoreWeeklyPage extends HighscoreGeneralPage {
  constructor(scoreService: ScoreService, platform: Platform) {
    super(scoreService, platform);
  }

  getScores() {
    return this.score.getWeekly();
  }

  getTitle() {
    return "Weekly";
  }
}

@Page({
  templateUrl: "build/pages/highscore/highscore_list.html",
})
class HighscoreDailyPage extends HighscoreGeneralPage {
  constructor(scoreService: ScoreService, platform: Platform) {
    super(scoreService, platform);
  }

  getScores() {
    return this.score.getDaily();
  }

  getTitle() {
    return "Daily";
  }
}

@Page({
  templateUrl: "build/pages/highscore/page.html",
  directives: [Button]
})
export class HighscorePage {
  nav: NavController;
  platform: Platform;
  scoreService: ScoreService;

  constructor(nav: NavController, scoreService: ScoreService, platform: Platform) {
    this.nav = nav;
    this.platform = platform;
    this.scoreService = scoreService;

    this.dailyTab = HighscoreDailyPage;
    this.weeklyTab = HighscoreWeeklyPage;
    this.monthlyTab = HighscoreMonthlyPage;
    this.generalTab = HighscoreGeneralPage;
  }
}
