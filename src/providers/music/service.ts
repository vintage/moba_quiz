import { Injectable } from "@angular/core";
import { Platform } from "ionic-angular";
import { MediaPlugin } from "ionic-native";

@Injectable()
export class MusicService {
  stream: MediaPlugin;

  constructor(public platform: Platform) {
    this.platform.pause.subscribe(() => {
      this.pause();
    });

    this.platform.resume.subscribe(() => {
      this.start();
    });
  }

  private getPath(): string {
    let path: string;
    if (this.platform.is("android")) {
      path = "/android_asset/www/assets/sfx/background.mp3";
    } else {
      path = "assets/sfx/background.mp3";
    }

    return path;
  }

  start() {
    if (!this.stream && !!window['cordova']) {
      this.stream = new MediaPlugin(this.getPath());
    }

    this.stream.play({
      playAudioWhenScreenIsLocked: false,
      numberOfLoops: 9999,
    });
  }

  stop() {
    if (!this.stream) {
      return;
    }

    this.stream.stop();
  }

  pause() {
    if (!this.stream) {
      return;
    }

    this.stream.pause();
  }

  enable() {
    if (!this.stream) {
      return;
    }

    this.stream.setVolume(1);
  }

  disable() {
    if (!this.stream) {
      return;
    }

    this.stream.setVolume(0);
  }
}
