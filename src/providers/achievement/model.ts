import _ from "lodash";

export abstract class AbstractAchievementModel {
  progress: number;

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public goal: number) {
  }

  abstract update(current: any, value?: any): any;
  abstract setProgress(current: any): void;

  getImageSource(): string {
    return "assets/data_common/achievements/" + this.id + ".svg";
  }

  isLocked(): boolean {
    if (!this.progress) {
      return true;
    }

    return this.goal > this.progress;
  }
}

class BooleanAchievementModel extends AbstractAchievementModel {
  update(current: boolean) {
    return true;
  }

  setProgress(current: boolean) {
    if (current) {
      this.progress = 1;
    } else {
      this.progress = 0;
    }
  }
}

class NumberAchievementModel extends AbstractAchievementModel {
  update(current: number, value: number) {
    if (!current) {
      current = 0;
    }

    return Math.max(current || 0, value || 0);
  }

  setProgress(current: number) {
    this.progress = Math.min(current || 0, this.goal);
  }
}

class IncrementAchievementModel extends AbstractAchievementModel {
  update(current: number) {
    if (!current) {
      current = 0;
    }

    return current + 1;
  }

  setProgress(current: number) {
    this.progress = current || 0;
  }
}

class ArrayAchievementModel extends AbstractAchievementModel {
  update(current: any, value: any) {
    if (!current) {
      current = [];
    }

    let result = current.slice();

    if (result.indexOf(value) === -1) {
      result.push(value);
    }

    return result;
  }

  setProgress(current: any) {
    if (!current) {
        current = [];
    }

    this.progress = current.length;
  }
}

export class AchievementFactory {
  static factoryMap: Object = {
    "boolean": BooleanAchievementModel,
    "array": ArrayAchievementModel,
    "number": NumberAchievementModel,
    "increment": IncrementAchievementModel
  };

  public static createAchievement(json: Object): AbstractAchievementModel {
    let id: string = _.get(json, "id", "");
    let name: string = _.get(json, "name", "");
    let description: string = _.get(json, "description", "");
    let goal: number = _.get(json, "goal", null);

    let type: string = _.get(json, "type", "");

    let factory = this.factoryMap[type];
    return new factory(id, name, description, goal);
  }
}
