/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import moment from 'moment-timezone';
import * as lodash from 'lodash';

import {
  DateRange,
} from 'client-shared-utils';

@Injectable({
  providedIn: 'root',
})
export class UtilsServiceV1 {

  constructor() {
    //
  }

  public convertDatesToTimestamps(dateFrom, dateTo, timezone) {
    const RET_VAL: any = {};
    if (
      timezone &&
      dateFrom
    ) {
      const timestampFrom = moment.tz(dateFrom, 'MM/DD/YYYY', timezone).clone().startOf('day').utc().toISOString();
      RET_VAL.timestampFrom = timestampFrom;
    }
    if (
      timezone &&
      dateTo
    ) {
      const timestampTo = moment.tz(dateTo, 'MM/DD/YYYY', timezone).clone().endOf('day').utc().toISOString();
      RET_VAL.timestampTo = timestampTo;
    }
    return RET_VAL;
  }


  public sanitizeDateRangeForQuery(range: DateRange, timezone) {
    const RET_VAL: any = {};
    if (
      range?.from
    ) {
      const DATE_FROM_AS_STR = moment(range.from).format('MM/DD/YYYY');
      RET_VAL.from = moment.tz(DATE_FROM_AS_STR, 'MM/DD/YYYY', timezone).clone().startOf('day').utc(true).toISOString();
    }
    if (
      range?.to
    ) {
      const DATE_TO_AS_STR = moment(range.to).format('MM/DD/YYYY');
      RET_VAL.to = moment.tz(DATE_TO_AS_STR, 'MM/DD/YYYY', timezone).clone().endOf('day').utc(true).toISOString();
    }
    return RET_VAL;
  }

  public transformDateString(date, includeTime = true) {
    let retVal = ''
    if (
      !lodash.isEmpty(date) &&
      lodash.isString(date)
    ) {
      const DATE = date.substring(0, 10);
      retVal = DATE;

      if (includeTime) {
        const TIME = date.substring(11, 16);
        retVal = retVal + ' ' + TIME;
      }
    }
    return retVal;
  }

  public getDaysBetweenTwoDays(dayFrom: Date, dayTo: Date) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    let retVal = 0;
    if (dayFrom && dayTo) {
      retVal = Math.floor(
        (
          Date.UTC(dayTo.getFullYear(), dayTo.getMonth(), dayTo.getDate()) -
          Date.UTC(dayFrom.getFullYear(), dayFrom.getMonth(), dayFrom.getDate())
        ) / MS_PER_DAY
      );
    }
    return retVal;
  }

}
