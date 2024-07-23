/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import moment from 'moment-timezone';


import {
  _debugX,
  DateRange
} from 'client-shared-utils';

import {
  SessionServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aca-date-range-picker',
  templateUrl: './date-range-picker.html',
  styleUrls: ['./date-range-picker.scss'],
})
export class DateRangePicker implements OnInit {

  static getClassName() {
    return 'DateRangePicker';
  }


  @Input()
  set value(newValue: DateRange) {
    this._sanitizeToDate(newValue);
    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(newValue);
    this._setValue(NEW_VALUE_SANITIZED);
  }

  @Output() onChange = new EventEmitter<DateRange>();

  _range: (Date | string)[];
  _value: DateRange;

  readonly DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';

  constructor(
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit(): void {
    //
  }

  handleModeChange(mode: string): void {
    _debugX(DateRangePicker.getClassName(), 'handleModeChange',
      {
        mode
      });

    if (this._value.mode !== mode) {
      this._value.mode = mode;
      const NEW_VALUE_SANITIZED = this._sanitizeFromDate(this._value);
      this._setValue(NEW_VALUE_SANITIZED, true);
    }
  }

  moveRange(direction: number): void {
    if (
      this._value?.to &&
      this._value?.from
    ) {
      const NEW_VALUE = {
        to: this._moveAndCloneDateByInterval(this._value.to, { mode: this._value.mode, direction: direction }),
        from: undefined,
        mode: this._value.mode,
      };
      const NEW_VALUE_SANITIZED = this._sanitizeFromDate(NEW_VALUE);
      this._setValue(NEW_VALUE_SANITIZED, true);
    }
  }

  handleValueChange(range: Date[]): void {
    _debugX(DateRangePicker.getClassName(), 'handleValueChange',
      {
        this_range: this._range,
        range: range
      });

    if (
      range &&
      range.length > 1 &&
      range[0] &&
      range[1]
    ) {

      const FROM_RANGE = this._createTimeZoneDateString(range?.[0])
      const TO_RANGE = this._createTimeZoneDateString(range?.[1])

      const FROM = this._convertDateToStringWithTimeZone(FROM_RANGE, false);
      const TO = this._convertDateToStringWithTimeZone(TO_RANGE);

      this._setValue({
        from: FROM,
        to: TO,
        mode: this._value.mode,
      }, true);
    } else if (
      range &&
      range.length == 0
    ) {
      this._setValue({
        from: undefined,
        to: undefined,
        mode: this._value.mode
      }, false);
    }
  }

  isDateRangeInvalid() {
    let retVal = true;
    if (
      this._range &&
      this._range.length > 1 &&
      this._range[0] &&
      this._range[1]
    ) {
      retVal = false;
    }
    return retVal;
  }

  handleSetToNow(): void {
    const NEW_VALUE = lodash.cloneDeep(this._value);

    const TO_DATE = this._convertDateToStringWithTimeZone(new Date());
    NEW_VALUE.to = TO_DATE;

    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(NEW_VALUE);
    this._setValue(NEW_VALUE_SANITIZED, true);
  }

  private _setValue(value: DateRange, emit: boolean = false) {
    this._range = [value?.from, value?.to];
    this._value = value;
    _debugX(DateRangePicker.getClassName(), 'setValue',
      {
        this_range: this._range,
        this__value: this._value,
        value: value,
        emit: emit
      });

    if (
      emit
    ) {
      this.onChange.emit(this._value);
    }
  }

  _sanitizeToDate(value: DateRange): void {
    const TO_DATE = this._convertDateToStringWithTimeZone(value.to)
    value.to = TO_DATE;
  }

  private _sanitizeFromDate(value: DateRange): DateRange {
    _debugX(DateRangePicker.getClassName(), '_sanitizeFromDate',
      {
        value
      });

    let retVal: DateRange = value;
    if (
      value.to &&
      value.mode !== 'custom'
    ) {
      value.from = this._moveAndCloneDateByInterval(value.to, { mode: value.mode, direction: -1 }, true);
    }
    return retVal;
  }

  private _moveAndCloneDateByInterval(date: Date | string, interval: any, isFromDate: boolean = false) {
    let retVal;
    let currDate;
    if (
      date &&
      interval.mode &&
      interval.direction
    ) {
      retVal = new Date(date);
      currDate = new Date(date);
      switch (interval.mode) {
        case 'day':
          retVal.setDate(currDate.getDate() + 1 * interval.direction);
          break;
        case 'week':
          retVal.setDate(currDate.getDate() + 7 * interval.direction);
          break;
        case 'month':
          retVal.setMonth(currDate.getMonth() + 1 * interval.direction);
          break;
        case '3months':
          retVal.setMonth(currDate.getMonth() + 3 * interval.direction);
          break;
        case '6months':
          retVal.setMonth(currDate.getMonth() + 6 * interval.direction);
          break;
        case '1year':
          retVal.setMonth(currDate.getMonth() + 12 * interval.direction);
          break;
        default:
          break;

      }

      if (isFromDate) {
        retVal.setMilliseconds(retVal.getMilliseconds() + 1);
      }

      retVal = this._convertDateToStringWithTimeZone(retVal, false)
    }
    return retVal;
  }

  _convertDateToStringWithTimeZone(date: Date | string, setToEndOfDay: boolean = true) {
    const TIME_ZONE = this.sessionService.getTimeZone();

    const DATE_TIME = moment(date).tz(TIME_ZONE);

    if (setToEndOfDay) {
      DATE_TIME.set(
        {
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }
      );
    }

    const RET_VAL = DATE_TIME.format(this.DATE_FORMAT);

    return RET_VAL;
  }

  _createTimeZoneDateString(date: Date) {
    const TIME_ZONE = this.sessionService.getTimeZone();
    const DATE = moment(date).format('YYYY-MM-DD');
    const RET_VAL = moment.tz(DATE, TIME_ZONE).format(this.DATE_FORMAT);

    return RET_VAL;
  }
}
