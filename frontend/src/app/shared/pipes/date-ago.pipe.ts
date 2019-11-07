import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date, agoOrLeft: string = null, response: string, loop: boolean = false): any {
    if (value) {
      let seconds =
        agoOrLeft === 'left' || loop
          ? Math.floor((+new Date(value) - +new Date()) / 1000)
          : Math.floor((+new Date() - +new Date(value)) / 1000);
      if (agoOrLeft === 'ago' && new Date(value) > new Date()) {
        return response;
      }
      if (seconds < 29) {
        // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      }
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      };
      let counter;
      let message = '';
      // tslint:disable-next-line: forin
      for (const [i, j] of Object.keys(intervals).entries()) {
        counter = Math.floor(seconds / intervals[j]);
        if (loop) {
          seconds %= intervals[j];
        }
        if (counter > 0) {
          if (counter === 1) {
            if (!loop) {
              return `${counter} ${j} - ${agoOrLeft}`;
            } else {
              if (Object.keys(intervals).length - 1 === i) {
                message += `${counter} ${j}`; // singular (1 day ago)
              } else {
                message += `${counter} ${j}, `;
              }
            }
          } else {
            if (!loop) {
              return `${counter} ${j}'s - ${agoOrLeft}`;
            } else {
              if (Object.keys(intervals).length - 1 === i) {
                message += `${counter} ${j}'s`; // singular (1 day ago)
              } else {
                message += `${counter} ${j}'s, `;
              }
            }
          }
        }
      }
      if (loop) {
        return message;
      }
    }
    return value;
  }
}
