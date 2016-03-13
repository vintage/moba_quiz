import {Pipe, PipeTransform} from "angular2/core";

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
