/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DateRange } from 'client-utils';

import {
  _debugX
} from 'client-utils';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

@Component({
  selector: 'aca-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class AcaDateRangePickerComponent implements OnInit {

  static getClassName() {
    return 'AcaDateRangePickerComponent';
  }

  public static readonly DATE_FORMAT = 'MM/DD/YYYY';

  @Input()
  set value(newValue: DateRange) {
    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(newValue);
    this._setValue(NEW_VALUE_SANITIZED);
  }

  @Output() onChange = new EventEmitter<DateRange>();

  _range: Date[];
  _value: DateRange;

  constructor() { }

  ngOnInit(): void { }

  handleModeChange(mode: string): void {
    _debugX(AcaDateRangePickerComponent.getClassName(), 'handleModeChange', { mode });

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
    _debugX(AcaDateRangePickerComponent.getClassName(), 'handleValueChange', {
      this_range: this._range,
      range: range
    });
    if (
      range &&
      range.length > 1 &&
      range[0] &&
      range[1]
    ) {
      this._setValue({
        from: ramda.path([0], range),
        to: ramda.path([1], range),
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
    NEW_VALUE.to = new Date();
    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(NEW_VALUE);
    this._setValue(NEW_VALUE_SANITIZED, true);
  }

  private _setValue(value: DateRange, emit: boolean = false) {
    this._range = [value?.from, value?.to];
    this._value = value;
    _debugX(AcaDateRangePickerComponent.getClassName(), 'setValue', {
      this_range: this._range,
      this__value: this._value,
      value: value,
      emit: emit
    });
    if (emit) {
      this.onChange.emit(this._value);
    }
  }

  private _sanitizeFromDate(value: DateRange): DateRange {
    _debugX(AcaDateRangePickerComponent.getClassName(), '_sanitizeFromDate', { value });
    let retVal: DateRange = value;
    if (
      value.to &&
      value.mode !== 'custom'
    ) {
      value.from = this._moveAndCloneDateByInterval(new Date(value.to), { mode: value.mode, direction: -1 });
    }
    return retVal;
  }

  private _moveAndCloneDateByInterval(date: Date, interval: any) {
    let retVal;
    if (
      date &&
      interval.mode &&
      interval.direction
    ) {
      retVal = new Date();
      retVal.setTime(date.getTime());
      switch (interval.mode) {
        case 'day':
          retVal.setDate(date.getDate() + 1 * interval.direction);
          break;
        case 'week':
          retVal.setDate(date.getDate() + 7 * interval.direction);
          break;
        case 'month':
          retVal.setMonth(date.getMonth() + 1 * interval.direction);
          break;
        case '3months':
          retVal.setMonth(date.getMonth() + 3 * interval.direction);
          break;
        case '6months':
          retVal.setMonth(date.getMonth() + 6 * interval.direction);
          break;
        case '1year':
          retVal.setMonth(date.getMonth() + 12 * interval.direction);
          break;
        default:
          break;
      }
    }
    return retVal;
  }

}
