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
  ContentChild,
  TemplateRef,
} from '@angular/core';

import { ControlContainer, NgForm } from '@angular/forms';

import lodash from 'lodash';

import { _debugX } from 'client-shared-utils';

@Component({
  selector: 'aiap-field-dropdown-v1',
  templateUrl: './field-dropdown-v1.html',
  styleUrls: ['./field-dropdown-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ],
})
export class FieldDropDownV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldDropDownV1';
  }

  @Input() type: any;

  @Input() label: any;
  @Input() placeholder: any;
  @Input() name: any;

  @Input() size: any = 'md';

  @Input() isRequired = false;
  @Input() isDisabled = false;
  @Input() skeleton = false;

  @Input() items: any[];
  @Output() onSelected = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ContentChild('dropdownRenderer', { read: TemplateRef }) dropdownRenderer: TemplateRef<any>;

  _state = {
    type: null,
    label: null,
    placeholder: null,
    name: null,
    size: null,
    isRequired: false,
    isDisabled: false,
    skeleton: false,
    value: null,
    items: null,
    dropdownRenderer: null,
  };
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.type = this.type;
    STATE_NEW.label = this.label;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.name = this.name;
    STATE_NEW.size = this.size;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.value = this.value;
    STATE_NEW.items = this.items;
    STATE_NEW.dropdownRenderer = this.dropdownRenderer;

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.type = this.type;
    STATE_NEW.label = this.label;
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.name = this.name;
    STATE_NEW.size = this.size;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.skeleton = this.skeleton;
    STATE_NEW.value = this.value;
    STATE_NEW.items = this.items;
    STATE_NEW.dropdownRenderer = this.dropdownRenderer;

    this.state = STATE_NEW;
  }

  handleEventValueChange(event: any) {
    _debugX(FieldDropDownV1.getClassName(), 'handleEventValueChange',
      {
        event,
      });
    this.valueChange.emit(this.state.value);
  }

  handleOnSelectionEvent(event: any) {
    _debugX(FieldDropDownV1.getClassName(), 'handleOnSelectionEvent', {
      event,
    });

    this.onSelected.emit(event);
  }
}
