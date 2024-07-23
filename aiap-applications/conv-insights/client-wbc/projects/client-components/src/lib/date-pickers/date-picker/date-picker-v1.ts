/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-date-picker-v1',
  templateUrl: './date-picker-v1.html',
  styleUrls: ['./date-picker-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class DatePickerV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'DatePickerV1';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @Input() dateFormat = "m/d/Y";
  @Input() label: string | TemplateRef<any>;
  @Input() placeholder = "mm/dd/yyyy";
  @Input() theme: "light" | "dark" = "dark";
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() invalidText: string | TemplateRef<any>;
  @Input() warn = false;
  @Input() warnText: string | TemplateRef<any>;
  @Input() size: "sm" | "md" | "xl" = "md";

  @Input() name = undefined;
  @Input() required: boolean = false;

  _state = {
    range: undefined,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(DatePickerV1.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.range = lodash.isDate(this.value) ? [this.value] : undefined;
    this.state = NEW_STATE;
  }

  handleValueChange(event: any) {
    _debugX(DatePickerV1.getClassName(), 'handleValueChange', {
      event: event,
      this_value: this.value
    });
    const NEW_VALUE = ramda.path([0], event);
    this.valueChange.emit(NEW_VALUE);
  }


}
