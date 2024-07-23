/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { LocalStorageServiceV1 } from 'client-shared-services';
import { DateRange } from 'client-shared-utils';

import {
  _debugX
} from 'client-shared-utils';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

@Component({
  selector: 'aca-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class AcaDateRangeComponent implements OnInit {

  static getClassName() {
    return 'AcaDateRangeComponent';
  }

  public static readonly DATE_FORMAT = 'MM/DD/YYYY';

  @Input()
  set value(newValue: DateRange) {
    const NEW_VALUE_SANITIZED = this._sanitizeFromDate(newValue);
    this._setValue(NEW_VALUE_SANITIZED);
  }

  @Input() label: string | TemplateRef<any>;
  @Input() checkInitialValue: boolean = true;

  @Output() onChange = new EventEmitter<DateRange>();

  _range: Date[];
  _value: DateRange;

  constructor() { }

  ngOnInit(): void { }


  handleValueChange(range: Date[]): void {
    _debugX(AcaDateRangeComponent.getClassName(), 'handleValueChange', {
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


  private _setValue(value, emit: boolean = false) {
    this._range = [value?.from, value?.to];
    this._value = value;
    _debugX(AcaDateRangeComponent.getClassName(), 'setValue', {
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
    _debugX(AcaDateRangeComponent.getClassName(), '_sanitizeFromDate', { value });
    let retVal: DateRange = value;
    if (
      value?.to
    ) {
      value.from = value?.from
    }
    return retVal;
  }

}
