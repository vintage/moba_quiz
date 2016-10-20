import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { NativeAudio } from 'ionic-native';

import { SettingsService } from '../settings/service';

@Injectable()
export class MusicService {
  constructor(
    public platform: Platform,
    private settings: SettingsService
  ) {
    this.platform.pause.subscribe(() => {
      this.pause();
    });

    this.platform.resume.subscribe(() => {
      this.start();
    });
  }

  load() {
    NativeAudio.preloadSimple('nextLevel', 'assets/sfx/next_level.wav');
    NativeAudio.preloadSimple('choiceValid', 'assets/sfx/choice_valid.wav');
    NativeAudio.preloadSimple('choiceInvalid', 'assets/sfx/choice_invalid.wav');
    NativeAudio.preloadSimple('skip', 'assets/sfx/skip.wav');
    NativeAudio.preloadSimple('newHighscore', 'assets/sfx/new_best_score.mp3');
    
    return NativeAudio.preloadComplex('background', 'assets/sfx/background.mp3', 1, 1, 0);
  }

  play(name: string) {
    this.settings.isSoundEnabled().then(isEnabled => {
      if (isEnabled) {
        NativeAudio.play(name, () => {});
      }
    });
  }

  start() {
    return NativeAudio.loop('background');
  }

  stop() {
    return NativeAudio.stop('background');
  }

  pause() {
    return NativeAudio.stop('background');
  }

  enable() {
    return NativeAudio.setVolumeForComplexAsset('background', 0.5);
  }

  disable() {
    return NativeAudio.setVolumeForComplexAsset('background', 0);
  }
}
