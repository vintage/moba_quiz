import {Component} from "@angular/core";

import { HighscoreGeneralPage } from './highscore-general/highscore-general';
import { HighscoreMonthlyPage } from './highscore-monthly/highscore-monthly';
import { HighscoreDailyPage } from './highscore-daily/highscore-daily';
import { HighscoreHardcorePage } from './highscore-hardcore/highscore-hardcore';

@Component({
  selector: 'page-highscore',
  templateUrl: "highscore.html",
})
export class HighscorePage {
  dailyTab = HighscoreDailyPage;
  monthlyTab = HighscoreMonthlyPage;
  generalTab = HighscoreGeneralPage;
  hardcoreTab = HighscoreHardcorePage;

  ionViewDidEnter() {
    if (window["analytics"]) {
      window["analytics"].trackView("Highscore");
    }
  }
}
