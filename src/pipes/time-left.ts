import {Pipe, PipeTransform} from "@angular/core";

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
