import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncuateText'
})
export class TruncuateTextPipe implements PipeTransform {
  transform(value: string, length = 100): any {
    if (value.length <= length) {
      return value;
    }
    return value.slice(0, length).concat('...');
  }
}
