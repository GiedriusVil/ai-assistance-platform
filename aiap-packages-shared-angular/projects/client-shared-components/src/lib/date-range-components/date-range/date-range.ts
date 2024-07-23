/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';


import * as ramda from 'ramda';

import {
  DateRange,
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-date-range',
  templateUrl: './date-range.html',
  styleUrls: ['./date-range.scss'],
})
export class DateRangeComponent implements OnInit {

  static getClassName() {
    return 'DateRangeComponent';
  }

  public static readonly DATE_FORMAT = 'MM/DD/YYYY';

  @Input()
  set value(newValue: DateRange) {
    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(newValue);
    this._setValue(NEW_VALUE_SANITIZED);
  }

  @Input() label: string | TemplateRef<any>;
  @Input() checkInitialValue = true;

  @Output() onChange = new EventEmitter<DateRange>();

  _range: Date[];
  _value: DateRange;

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  handleValueChange(range: Date[]): void {
    _debugX(DateRangeComponent.getClassName(), 'handleValueChange', {
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
      }, true);
    } else if (
      range &&
      range.length == 0
    ) {
      this._setValue({
        from: undefined,
        to: undefined,
      }, false);
    }
  }

  isDateRangeInvalid() {
    let retVal = true;
    if (!this.checkInitialValue) {
      return false;
    }
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


  private _setValue(value, emit = false) {
    this._range = [value?.from, value?.to];
    this._value = value;
    _debugX(DateRangeComponent.getClassName(), 'setValue', {
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
    _debugX(DateRangeComponent.getClassName(), '_sanitizeFromDate',
      {
        value,
      });

    const RET_VAL: DateRange = value;
    if (
      value?.to
    ) {
      value.from = value?.from;
    }
    return RET_VAL;
  }

}
