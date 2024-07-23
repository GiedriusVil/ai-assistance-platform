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
  selector: 'aiap-field-input-v1',
  templateUrl: './field-input-v1.html',
  styleUrls: ['./field-input-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ]
})
export class FieldInputV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldInputV1';
  }

  @Input() label: any;
  @Input() labelHelp: any;

  @Input() type: any;
  @Input() size: any = 'md';

  @Input() name: any;
  @Input() placeholder: any = '';

  @Input() isRequired = false;
  @Input() isDisabled = false;
  @Input() skeleton: any = false;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state = {
    label: null,
    labelHelp: null,
    type: null,
    value: null,
    name: null,
    skeleton: false,
    size: 'md',
    placeholder: null,
    isRequired: false,
    isDisabled: false,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);


    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;
    STATE_NEW.type = this.type;
    STATE_NEW.value = this.value;
    STATE_NEW.name = this.name;
    STATE_NEW.size = this.size;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;
    STATE_NEW.type = this.type;
    STATE_NEW.value = this.value;
    STATE_NEW.name = this.name;
    STATE_NEW.size = this.size;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    this.state = STATE_NEW;
  }

  handleEventValueChange(event: any) {
    _debugX(FieldInputV1.getClassName(), 'handleEventValueChange',
      {
        event: event,
        this_state_value: this.state?.value,
      })
    this.valueChange.emit(event);
  }

}
