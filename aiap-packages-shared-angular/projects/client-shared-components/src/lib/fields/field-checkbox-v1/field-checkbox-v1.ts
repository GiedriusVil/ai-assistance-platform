/*
  © Copyright IBM Corporation 2023. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { 
  ControlContainer,
  NgForm
} from '@angular/forms';

import lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

export interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
  value: any;
  label?: string;
  isDisabled?: boolean;
}

@Component({
  selector: 'aiap-field-checkbox-v1',
  templateUrl: './field-checkbox-v1.html',
  styleUrls: ['./field-checkbox-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ]
})
export class FieldCheckboxV1 implements OnInit, OnChanges {
  static getClassName() {
    return 'FieldCheckboxV1';
  }

  @Input() id: any;
  @Input() label: string;
  @Input() text: string;
  @Input() checked = false;
  @Input() isDisabled = false;
  @Input() value: any;

  @Output() checkedChange = new EventEmitter<any>();
  @Output() onClick = new EventEmitter<any>();

  _state = {
    id: null,
    label: null,
    text: null,
    checked: false,
    isDisabled: false,
    value: null,
  }
  state = lodash.cloneDeep(this._state)

  constructor() {
    // 
  }

  ngOnInit(): void {
    this._refreshState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._refreshState();
  }

  handleCheckChanged(event: any) {
    _debugX(FieldCheckboxV1.getClassName(), 'handleCheckChanged', { event, this_state_value: this.state.value });
    this.checkedChange.emit(event);
  }

  _refreshState() {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.id = this.id;
    STATE_NEW.checked = this.checked;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.label = this.label;
    STATE_NEW.text = this.text;
    STATE_NEW.value = this.value;
    this.state = STATE_NEW;
  }
}
