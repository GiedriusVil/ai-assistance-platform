/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Optional,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';
import { ListItem } from 'carbon-components-angular';

export interface ComboboxItem {
  id: string;
  placeholder: string;
  label: string;
  items: Array<ListItem>;
  value: any;
  type: string;
  name?: string;
  labelHelp?: string;
  size?: string;
  isRequired?: boolean;
  isDropUp?: boolean;
}

@Component({
  selector: 'aiap-field-combo-box-singular-v1',
  templateUrl: './field-combo-box-singular-v1.html',
  styleUrls: ['./field-combo-box-singular-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ],
})
export class FieldComboBoxV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldComboBoxV1';
  }

  @Input() name: string;

  @Input() type: string = 'single' || 'multi';

  @Input() label: string;
  @Input() labelHelp: string;

  @Input() size: string;

  @Input() isRequired = false;
  @Input() isDisabled = false;
  @Input() isDropUp = false;

  @Input() placeholder: string;

  @Input() items: Array<any>;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @Output() onSelected = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Output() onScroll = new EventEmitter<any>();

  _state = {
    name: null,
    type: null,
    label: null,
    labelHelp: null,
    placeholder: null,
    size: null,
    isRequired: false,
    isDisabled: false,
    isDropUp: false,
    items: null,
    value: null,
  }
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    this.refreshState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.refreshState();
  }

  private refreshState() {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.name = this.name;
    STATE_NEW.type = this.type;
    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp
    STATE_NEW.placeholder = this.placeholder;
    STATE_NEW.size = this.size;
    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;
    STATE_NEW.isDropUp = this.isDropUp;
    STATE_NEW.value = this.value;
    STATE_NEW.items = this.items;

    this.state = STATE_NEW;
  }

  handleEventSelected(event: any) {
    _debugX(FieldComboBoxV1.getClassName(), 'handleEventSelected',
      {
        event,
      });
    this.onSelected.emit(event);
  }

  handleEventSubmit(event: any) {
    _debugX(FieldComboBoxV1.getClassName(), 'handleEventSubmit',
      {
        event,
      });
    this.onSubmit.emit(event);
  }

  handleEventClose(event: any) {
    _debugX(FieldComboBoxV1.getClassName(), 'handleEventClose',
      {
        event,
      });
    this.onClose.emit(event);
  }

  handleEventSearch(event: any) {
    _debugX(FieldComboBoxV1.getClassName(), 'handleEventSearch',
      {
        event,
      });
    this.onSearch.emit(event);
  }

  handleEventScroll(event: any) {
    _debugX(FieldComboBoxV1.getClassName(), 'handleEventScroll',
      {
        event,
      });
    this.onScroll.emit(event);
  }

}
