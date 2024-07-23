/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Optional,
} from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';

import lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

@Component({
  selector: 'aiap-field-textarea-v1',
  templateUrl: './field-textarea-v1.html',
  styleUrls: ['./field-textarea-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    },
  ],
})
export class FieldTextAreaV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldTextAreaV1';
  }

  @Input() label: any;
  @Input() labelHelp: any;

  @Input() name: any;
  @Input() placeholder: any;

  @Input() isRequired = false;
  @Input() isDisabled = false;

  @Input() rows: any;
  @Input() cols: any;

  @Output() onKeyDown = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state = {
    label: null,
    labelHelp: null,
    value: null,
    name: null,
    placeholder: null,
    isRequired: false,
    isDisabled: false,
    rows: null,
    cols: null,
  };
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;
    STATE_NEW.value = this.value;
    STATE_NEW.name = this.name;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.rows = this.rows;
    STATE_NEW.cols = this.cols;

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;
    STATE_NEW.value = this.value;
    STATE_NEW.name = this.name;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.rows = this.rows;
    STATE_NEW.cols = this.cols;

    this.state = STATE_NEW;
  }

  handleEventValueChange(event: any) {
    _debugX(FieldTextAreaV1.getClassName(), 'handleEventValueChange',
      {
        event,
      });
    this.valueChange.emit(event);
  }

  handleEventKeyDown(event: any) {
    _debugX(FieldTextAreaV1.getClassName(), 'handleEventKeyDown', {
      event,
    });

    this.onKeyDown.emit(event);
  }
}
