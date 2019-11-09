import { Pipe, ChangeDetectorRef } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'dateAgo',
  pure: false
})
export class DateAgoPipe extends AsyncPipe {
  value: Date;
  agoOrLeft: string;
  response: string;
  loop: boolean;
  timer: Observable<string>;

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  transform(obj: any, args?: any[]): any {
    this.value = new Date(obj);
    const { agoOrLeft, response, loop } = args[0];
    this.agoOrLeft = agoOrLeft;
    this.response = response;
    this.loop = loop;
    if (this.value instanceof Date) {
      if (!this.timer) {
        this.timer = this.getObservable();
      }

      return super.transform(this.timer);
    }

    return super.transform(obj);
  }

  getObservable() {
    return interval(1000).pipe(
      map(() => {
        if (this.value) {
          let seconds =
            this.agoOrLeft === 'left' || this.loop
              ? Math.floor((+this.value - +new Date()) / 1000)
              : Math.floor((+new Date() - +this.value) / 1000);
          if (this.agoOrLeft === 'ago' && this.value > new Date()) {
            return this.response;
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
            // if (this.loop) {
              seconds %= intervals[j];
            // }
            if (counter > 0) {
              if (counter === 1) {
                // if (!this.loop) {
                //   return `${counter} ${j} - ${this.agoOrLeft}`;
                // } else {
                  if (Object.keys(intervals).length - 1 === i) {
                    message += `${counter} ${j}`; // singular (1 day ago)
                  } else {
                    message += `${counter} ${j}, `;
                  }
                // }
              } else {
                // if (!this.loop) {
                //   return `${counter} ${j}'s - ${this.agoOrLeft}`;
                // } else {
                  if (Object.keys(intervals).length - 1 === i) {
                    message += `${counter} ${j}'s`; // singular (1 day ago)
                  } else {
                    message += `${counter} ${j}'s, `;
                  }
                // }
              }
            }
          }
          // if (this.loop) {
            return message;
          // }
        }
        // return this.value.toString();
      })
    );
  }
}
