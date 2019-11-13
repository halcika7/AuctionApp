import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncateText"
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, length: number = 100): Error | string {
    if (typeof value !== "string") {
      return new Error("Value must be a string");
    }
    if (value.length <= length) {
      return value;
    }
    return value.slice(0, length).concat("...");
  }
}
