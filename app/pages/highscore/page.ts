import {OnInit} from 'angular2/core';
import {Button, Page, NavController, Platform} from 'ionic-framework/ionic';

import {ScoreService} from "../../providers/score/service";
import {ScoreModel} from "../../providers/score/model";

@Page({
  templateUrl: 'build/pages/highscore/highscore_list.html',
})
class HighscoreGeneralPage implements OnInit {
  title: string;
  scores: ScoreModel[];

  constructor(scoreService: ScoreService) {
    this.score = scoreService;
    this.title = 'General';
  }

  ngOnInit() {
    this.score.getAll().then(scores => {
      this.scores = scores;
    });
  }
}

@Page({
  templateUrl: 'build/pages/highscore/highscore_list.html',
})
class HighscoreMonthlyPage implements OnInit {
  title: string;

  constructor(scoreService: ScoreService) {
    this.score = scoreService;
    this.title = 'Monthly';
  }

  ngOnInit() {
    this.score.getMonthly().then(scores => {
      this.scores = scores;
    });
  }
}

@Page({
  templateUrl: 'build/pages/highscore/highscore_list.html',
})
class HighscoreWeeklyPage implements OnInit {
  title: string;
  scores: ScoreModel[];

  constructor(scoreService: ScoreService) {
    this.score = scoreService;
    this.title = 'Weekly';
  }

  ngOnInit() {
    this.score.getWeekly().then(scores => {
      this.scores = scores;
    });
  }
}

@Page({
  templateUrl: 'build/pages/highscore/page.html',
  directives: [Button]
})
export class HighscorePage {
  constructor(nav: NavController, scoreService: ScoreService, platform: Platform) {
    this.nav = nav;
    this.platform = platform;
    this.scoreService = scoreService;

    this.monthlyTab = HighscoreMonthlyPage;
    this.weeklyTab = HighscoreWeeklyPage;
    this.generalTab = HighscoreGeneralPage;
  }
}
