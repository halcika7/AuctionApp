import { Pipe, ChangeDetectorRef } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'dateAgo',
  pure: false
})
export class DateAgoPipe extends AsyncPipe {
  value: Date | string;
  agoOrLeft: string;
  response: string;
  loop: boolean;
  append: boolean;
  timer: Observable<string>;

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  transform(obj: any, args?: any[]): any {
    this.value = new Date(obj);
    const { agoOrLeft = 'left', response = '', loop = false, append = true } = args[0];
    this.agoOrLeft = agoOrLeft;
    this.response = response;
    this.loop = loop;
    this.append = append;
    if (!this.timer) {
      this.timer = this.getObservable();
    }
    return super.transform(this.timer);
  }

  getObservable() {
    return interval(1000).pipe(
      map(() => {
        let seconds =
          this.agoOrLeft === 'left' || this.loop
            ? Math.floor((+this.value - +new Date()) / 1000)
            : Math.floor((+new Date() - +this.value) / 1000);
        if (this.agoOrLeft === 'ago' && this.value > new Date()) {
          return this.response;
        }
        if (seconds < 29) {
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
        let counter = 0;
        let message = '';
        for (const [i, j] of Object.keys(intervals).entries()) {
          counter = Math.floor(seconds / intervals[j]);
          seconds %= intervals[j];
          if (counter > 0) {
            if (counter === 1) {
              message +=
                Object.keys(intervals).length - 1 === i ? `${counter} ${j}` : `${counter} ${j}, `;
            } else {
              message +=
                Object.keys(intervals).length - 1 === i
                  ? `${counter} ${j}'s`
                  : `${counter} ${j}'s, `;
            }
          }
        }
        return this.append ? `${message} ${this.agoOrLeft}` : message;
      })
    );
  }
}
