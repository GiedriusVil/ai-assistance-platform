/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';
import { SessionServiceV1 } from 'client-shared-services';

@Pipe({ name: 'toUserLocale' })
export class LocalePipe implements PipeTransform {

  constructor(
    private sessionService: SessionServiceV1,
  ) { }

  transform(value: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss', timezone: string = undefined) {
    if (!moment(value, true).isValid()) {
      return value;
    }
    const TIME_ZONE = timezone ?? this.sessionService.getTimeZone();
    const RET_VAL = moment(value).tz(TIME_ZONE).format(format);
    return RET_VAL;
  }
}
