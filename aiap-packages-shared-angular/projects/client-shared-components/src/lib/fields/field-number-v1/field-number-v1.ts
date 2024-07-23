/*
  © Copyright IBM Corporation 2023. All Rights Reserved

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
} from '@angular/core';

import lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  selector: 'aiap-field-number-v1',
  templateUrl: './field-number-v1.html',
  styleUrls: ['./field-number-v1.scss'],
})
export class FieldNumberV1 implements OnInit, OnChanges {
  static getClassName() {
    return 'FieldNumberV1';
  }

  @Input() min = 0;
  @Input() max = 100;
  @Input() invalid: any;
  @Input() invalidText: any;
  @Input() step = 1;
  @Input() value: any;

  @Output() valueChange = new EventEmitter<any>();

  _state = {
    min: null,
    max: null,
    invalid: null,
    invalidText: null,
    step: null,
    value: null,
  }
  state = lodash.cloneDeep(this._state);

  constructor() {
    // 
  }

  ngOnInit(): void {
    this._refreshState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._refreshState();
  }

  handleEventValueChange(event: any) {
    if (event?.value) {
      this.valueChange.emit(event.value);
    }
    _debugX(FieldNumberV1.getClassName(), 'handleEventValueChange', { event });
  }

  _refreshState() {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.min = this.min;
    STATE_NEW.max = this.max;
    STATE_NEW.invalid = this.invalid;
    STATE_NEW.invalidText = this.invalidText;
    STATE_NEW.step = this.step;
    STATE_NEW.value = this.value;
    this.state = STATE_NEW;
  }
}
