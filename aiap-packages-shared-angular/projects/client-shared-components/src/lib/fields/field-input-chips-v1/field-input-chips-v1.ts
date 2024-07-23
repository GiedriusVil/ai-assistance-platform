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
  selector: 'aiap-field-input-chips-v1',
  templateUrl: './field-input-chips-v1.html',
  styleUrls: ['./field-input-chips-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ]
})
export class FieldInputChipsV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldInputChipsV1';
  }

  @Input() placeholder = '';
  @Input() secondaryPlaceholder = '';
  @Input() theme = '';

  @Input() maxItems = 5;

  @Input() isEditable = false;
  @Input() isRemovable = false;

  @Input() value: any;
  @Output() onTextChange = new EventEmitter<any>();

  @Output() onAdd = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();

  _state = {
    placeholder: '',
    secondaryPlaceholder: '',
    theme: null,
    isEditable: false,
    isRemovable: false,
    value: null,
    maxItems: 0,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.secondaryPlaceholder = this.secondaryPlaceholder;
    STATE_NEW.theme = this.theme;
    STATE_NEW.isEditable = this.isEditable;
    STATE_NEW.isRemovable = this.isRemovable;
    STATE_NEW.value = this.value;
    STATE_NEW.maxItems = this.maxItems;
    _debugX(FieldInputChipsV1.getClassName(), 'ngOnInit', { STATE_NEW });

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.secondaryPlaceholder = this.secondaryPlaceholder;
    STATE_NEW.theme = this.theme;
    STATE_NEW.isEditable = this.isEditable;
    STATE_NEW.isRemovable = this.isRemovable;
    STATE_NEW.value = this.value;
    STATE_NEW.maxItems = this.maxItems;
    _debugX(FieldInputChipsV1.getClassName(), 'ngOnChanges', { STATE_NEW });

    this.state = STATE_NEW;
  }

  handleEventValueChange(event: any) {
    _debugX(FieldInputChipsV1.getClassName(), 'handleEventValueChange',
      {
        event: event,
        this_state_value: this.state?.value,
      })
    this.onTextChange.emit(event);
  }

  handleEventAddTags(event: any) {
    _debugX(FieldInputChipsV1.getClassName(), 'handleEventAddTags',
      {
        event: event,
        this_state_value: this.state?.value,
      })
    this.onAdd.emit(event);
  }

  handleEventRemoveTags(event: any) {
    _debugX(FieldInputChipsV1.getClassName(), 'handleEventRemoveTags',
      {
        event: event,
        this_state_value: this.state?.value,
      })
    this.onRemove.emit(event);
  }
}
