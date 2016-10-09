import {Component, OnInit} from "@angular/core";
import {Platform} from "ionic-angular";

import {ScoreService} from "../../providers/score/service";
import {ScoreModel} from "../../providers/score/model";

let tabTemplate = `
  <ion-header>
    <ion-navbar>
      <ion-title>Highscore</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content class="highscore-list">
    <div class="panel-box">
      <div *ngIf="isOnline">
        <ion-card *ngIf="!scores">
          <ion-card-content>
            <ion-spinner name="crescent"></ion-spinner>
          </ion-card-content>
        </ion-card>

        <ion-list no-lines *ngIf="scores && scores.length">
          <ion-item *ngFor="let score of scores; let i=index">
            <button ion-button color="dark" item-left class="position-box">
              <span *ngIf="i < 9" class="zero-prefix">0</span>
              <span>{{ i + 1 }}</span>
            </button>

            <ion-avatar item-left>
              <img src="{{ getScorePlatformImage(score) }}" class="platform">
              <img src="{{ score.getImageSource() }}" class="flag">
            </ion-avatar>

            <h2>{{ score.score|points }}</h2>
            <p>{{ score.player|slice:0:16 }}</p>
          </ion-item>
        </ion-list>

        <ion-card *ngIf="scores && !scores.length">
          <ion-card-header>
            Good news,
          </ion-card-header>

          <ion-card-content>
            It seems there are no score for this leaderboard.
            Play your <b>first game</b> and be the best one!
          </ion-card-content>
        </ion-card>
      </div>

      <div *ngIf="!isOnline">
        <ion-card>
          <ion-card-header>
            Unable to fetch scores,
          </ion-card-header>

          <ion-card-content>
            It seems that you are not connected to the Internet.
            Check your connection and try again to see the <b>best players</b> scores!
          </ion-card-content>
        </ion-card>
      </div>
    </div>
  </ion-content>
`;

@Component({
  selector: 'page-highscore-general',
  template: tabTemplate,
})
export class HighscoreGeneralPage implements OnInit {
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
  selector: 'page-highscore-monthly',
  template: tabTemplate,
})
export class HighscoreMonthlyPage extends HighscoreGeneralPage {
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
  selector: 'page-highscore-weekly',
  template: tabTemplate,
})
export class HighscoreWeeklyPage extends HighscoreGeneralPage {
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
  selector: 'page-highscore-daily',
  template: tabTemplate,
})
export class HighscoreDailyPage extends HighscoreGeneralPage {
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
  selector: 'page-highscore',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Highscore</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-tabs>
    <ion-tab tabTitle="Daily" [root]="dailyTab"></ion-tab>
    <ion-tab tabTitle="Weekly" [root]="weeklyTab"></ion-tab>
    <ion-tab tabTitle="Monthly" [root]="monthlyTab"></ion-tab>
    <ion-tab tabTitle="Best ever" [root]="generalTab"></ion-tab>
  </ion-tabs>
  `,
  //templateUrl: "highscore.html",
})
export class HighscorePage {
  dailyTab = HighscoreDailyPage;
  weeklyTab = HighscoreWeeklyPage;
  monthlyTab = HighscoreMonthlyPage;
  generalTab = HighscoreGeneralPage;

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Highscore");
    }
  }
}
