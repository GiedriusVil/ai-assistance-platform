/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  DEFAULT_CONTEXT_FIELD_WRAPPER_V1,
} from './field-wrapper-v1-constants';

@Component({
  selector: 'aiap-field-wrapper-v1',
  templateUrl: './field-wrapper-v1.html',
  styleUrls: ['./field-wrapper-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm
    }
  ]
})
export class FieldWrapperV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldWrapperV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state: any = {
    context: DEFAULT_CONTEXT_FIELD_WRAPPER_V1,
    value: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor() { }

  ngOnInit(): void { }

  url() {
    const HOST = this.state?.context?.wbc?.host;
    const PATH = this.state?.context?.wbc?.path;
    const RET_VAL = HOST + PATH;
    return RET_VAL;
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(FieldWrapperV1.getClassName(), 'ngOnChanges', {
      this_context: this.context,
      this_value: this.value,
      changes: changes,
    });
    try {
      const NEW_STATE = lodash.cloneDeep(this.state);

      NEW_STATE.value = this.value;
      NEW_STATE.context = ramda.mergeDeepRight(DEFAULT_CONTEXT_FIELD_WRAPPER_V1, this.context);

      this.state = NEW_STATE;

      _debugX(
        FieldWrapperV1.getClassName(),
        'ngOnChanges',
        {
          NEW_STATE,
        });
    } catch (error: any) {
      _errorX(
        FieldWrapperV1.getClassName(),
        'ngOnChanges',
        {
          error
        });
      throw error;
    }
  }

  handleContextChange(event: any) {
    _debugX(
      FieldWrapperV1.getClassName(),
      'handleContextChange',
      {
        event: event,
        this_context_value: this.context.value,
      });

    this.contextChange.emit(this.state.context);
  }

  handleValueChange(event: any) {
    _debugX(
      FieldWrapperV1.getClassName(),
      'handleValueChange',
      {
        event: event,
        this_state_value: this.state.value,
      });

    this.valueChange.emit(this.state.value);
  }

  isValid() {
    const RET_VAL = true;
    return RET_VAL;
  }

}
