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
  selector: 'aca-date-picker',
  templateUrl: './aca-date-picker.component.html',
  styleUrls: ['./aca-date-picker.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AcaDatePicker implements OnInit, OnChanges {

  static getClassName() {
    return 'AcaDatePicker';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @Input() dateFormat = "m/d/Y";
  @Input() label: string | TemplateRef<any>;
  @Input() name = undefined;
  @Input() placeholder = "mm/dd/yyyy";
  @Input() theme: "light" | "dark" = "dark";
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() invalidText: string | TemplateRef<any>;
  @Input() warn = false;
  @Input() warnText: string | TemplateRef<any>;
  @Input() size: "sm" | "md" | "xl" = "md";

  @Input() required: boolean = false;

  _state = {
    range: undefined,
  }
  state: any = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AcaDatePicker.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.range = lodash.isDate(this.value) ? [this.value] : undefined;
    this.state = NEW_STATE;
  }

  handleValueChange(event: any) {
    _debugX(AcaDatePicker.getClassName(), 'handleValueChange', {
      event: event,
      this_value: this.value
    });
    const NEW_VALUE = ramda.path([0], event);
    this.valueChange.emit(NEW_VALUE);
  }


}
