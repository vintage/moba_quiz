import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "points"})
export class PointsPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    if (!value) {
      return value;
    }

    let reversed = value.toString().split("").reverse().join("");

    let result = "", iter = 0;
    for (let digit of reversed) {
      result += digit;

      iter += 1;
      if (iter % 3 === 0) {
        result += " ";
      }
    }

    return result.split("").reverse().join("");
  }
}

@Pipe({name: "timeLeft"})
export class TimeLeftPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    if (isNaN(value)) {
      return value;
    }

    let stringValue = value.toString();
    if (stringValue.length > 1) {
      return stringValue;
    }

    return "0" + stringValue;
  }
}
