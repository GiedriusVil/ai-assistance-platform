/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';

import { JsonEditorOptions } from 'ang-jsoneditor';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  BaseModalV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-doc-validation-modal-v2',
  templateUrl: './doc-validation-modal-v2.html',
  styleUrls: ['./doc-validation-modal-v2.scss']
})
export class DocValidationModalV2 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DocValidationModalV2';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

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
    ruleType: undefined,
  };
  value = lodash.cloneDeep(this._value);

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
    _debugX(DocValidationModalV2.getClassName(), `show`, { value });
    if (
      !lodash.isEmpty(value)
    ) {
      this.value = lodash.cloneDeep(value);
    } else {
      this.value = lodash.cloneDeep(this._value);
    }
    this.superShow();
  }
}
