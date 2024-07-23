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

import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  selector: 'aiap-field-toggle-v1',
  templateUrl: './field-toggle-v1.html',
  styleUrls: ['./field-toggle-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ]
})
export class FieldToggleV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldInputV1';
  }

  @Input() size: any;

  @Input() label: any;
  @Input() name: any;

  @Input() onText: any = '';
  @Input() offText: any = '';

  @Input() checked: boolean = false;

  @Input() isRequired = false;
  @Input() isDisabled = false;

  @Input() hideLabel = false;

  @Input() skeleton: any = false;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state = {
    size: null,
    label: null,
    onText: '',
    offText: '',
    checked: false,
    value: null,
    name: null,
    skeleton: false,
    hideLabel: false,
    isRequired: false,
    isDisabled: false,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);


    STATE_NEW.size = this.size;
    STATE_NEW.label = this.label;
    STATE_NEW.onText = this.onText;
    STATE_NEW.offText = this.offText;
    STATE_NEW.value = this.value;
    STATE_NEW.checked = this.checked;
    STATE_NEW.name = this.name;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.hideLabel = this.hideLabel;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.size = this.size;
    STATE_NEW.label = this.label;
    STATE_NEW.onText = this.onText;
    STATE_NEW.offText = this.offText;
    STATE_NEW.value = this.value;
    STATE_NEW.checked = this.checked;
    STATE_NEW.name = this.name;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.hideLabel = this.hideLabel;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    this.state = STATE_NEW;
  }

  handleEventValueChange(event: any) {
    _debugX(FieldToggleV1.getClassName(), 'handleEventValueChange',
      {
        event: event,
        this_state_value: this.state?.value,
      })
    this.valueChange.emit(event);
  }

}
