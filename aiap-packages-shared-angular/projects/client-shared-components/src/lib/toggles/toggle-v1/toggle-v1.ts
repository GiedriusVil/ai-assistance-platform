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
} from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';

import lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

@Component({
  selector: 'aiap-toggle-v1',
  templateUrl: './toggle-v1.html',
  styleUrls: ['./toggle-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    },
  ],
})
export class ToggleV1 implements OnInit, OnChanges {
  static getClassName() {
    return 'ToggleV1';
  }

  @Input() onText: any;
  @Input() offText: any;
  @Input() label: any;
  @Input() hideLabel: any;
  @Input() size: any;

  @Input() isChecked = false;
  @Input() skeleton = false;
  @Input() disabled = false;

  @Output() onChange = new EventEmitter<any>();

  _state = {
    onText: null,
    offText: null,
    label: null,
    hideLabel: null,
    size: null,
    isChecked: false,
    skeleton: false,
    disabled: false,
  };
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.onText = this.onText;
    STATE_NEW.offText = this.offText;
    STATE_NEW.label = this.label;
    STATE_NEW.hideLabel = this.hideLabel;
    STATE_NEW.size = this.size;
    STATE_NEW.isChecked = this.isChecked;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.disabled = this.disabled;

    this.state = STATE_NEW;

    _debugX(ToggleV1.getClassName(), 'ngOnInit', {
      STATE_NEW,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.onText = this.onText;
    STATE_NEW.offText = this.offText;
    STATE_NEW.label = this.label;
    STATE_NEW.hideLabel = this.hideLabel;
    STATE_NEW.size = this.size;
    STATE_NEW.isChecked = this.isChecked;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.disabled = this.disabled;
    _debugX(ToggleV1.getClassName(), 'ngOnChanges', {
      changes: changes,
      STATE_NEW: STATE_NEW,
    });

    this.state = STATE_NEW;
  }

  handleChangeEvent(event: any) {
    const IS_CHECKED = event?.checked;
    _debugX(ToggleV1.getClassName(), 'handleChangeEvent', {
      IS_CHECKED,
    });

    this.onChange.emit(IS_CHECKED);
  }
}
