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

export interface SliderItem {
  id: string;
  label: string;
  max: number;
  value: number;
  maxLabel: any;
  minLabel?: any;
  min?: number;
  step?: number;
  isDisabled?: boolean;
}

@Component({
  selector: 'aiap-slider-v1',
  templateUrl: './field-slider-v1.html',
  styleUrls: ['./field-slider-v1.scss']
})
export class FieldSliderV1 implements OnInit, OnChanges {
  static getClassName() {
    return 'FieldSliderV1';
  }

  @Input() label: string;
  @Input() min = 0;
  @Input() max;
  @Input() step = 1;
  @Input() minLabel = 0;
  @Input() maxLabel;
  @Input() isDisabled = false;
  @Input() value;
  @Output() valueChange = new EventEmitter<any>();

  _state = {
    label: null,
    min: null,
    max: null,
    step: null,
    value: null,
    minLabel: null,
    maxLabel: null,
    isDisabled: false,
  };
  state = lodash.cloneDeep(this._state);

  ngOnInit(): void {
    this._refreshState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._refreshState();
  }

  handleEventValueChange(event: any) {
    this.valueChange.emit(event);
  }

  _refreshState() {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.label = this.label;
    STATE_NEW.min = this.min;
    STATE_NEW.max = this.max;
    STATE_NEW.step = this.step;
    STATE_NEW.value = this.value;
    STATE_NEW.minLabel = this.minLabel;
    STATE_NEW.maxLabel = this.maxLabel;
    STATE_NEW.isDisabled = this.isDisabled;
    this.state = STATE_NEW;
  }
}
