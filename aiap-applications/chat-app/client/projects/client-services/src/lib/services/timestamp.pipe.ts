import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'timestamp'})
export class TimestampPipe implements PipeTransform {
  transform(timestamp: number): string {
    const DATE = new Date(timestamp);
    return `${DATE.getHours()}:${DATE.getMinutes()}:${DATE.getSeconds()}`
  }
}
