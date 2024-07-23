/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';

import { JsonEditorOptions } from 'ang-jsoneditor';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseModalV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-rule-action-change-modal-v1',
  templateUrl: './rule-action-change-modal-v1.html',
  styleUrls: ['./rule-action-change-modal-v1.scss']
})
export class RuleActionsChangesModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleActionsChangesModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  isOpen = false;

  _value: any = {
    id: undefined,
    action: undefined,
    actionId: undefined,
    created: {
      user: {
        id: undefined,
        name: undefined,
      },
      date: undefined,
    },
    doc: {
      id: undefined,
    },
    docChanges: undefined,
    docType: undefined,
    updated: {
      user: {
        id: undefined,
        name: undefined,
      },
      date: undefined,
    },
  };
  value = lodash.cloneDeep(this._value);


  changesTooltip = `\`
  kind - indicates the kind of change; will be one of the following:
    N - indicates a newly added property/element
    D - indicates a property/element was deleted
    E - indicates a property/element was edited
    A - indicates a change occurred within an array\`
  `;

  constructor() {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Changes';
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  close() {
    this.isOpen = false;
  }

  show(value: any) {
    _debugW(RuleActionsChangesModalV1.getClassName(), `show`, { value });
    if (
      !lodash.isEmpty(value)
    ) {
      this.value = lodash.cloneDeep(value);
    } else {
      this.value = lodash.cloneDeep(this._value);
    }
    this.isOpen = true;
  }
}
