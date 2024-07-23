/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { JsonEditorOptions } from 'ang-jsoneditor';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  TimezoneServiceV1,
} from 'client-shared-services';

import {
  BaseModalV1,
} from 'client-shared-views';

import { LocalePipe } from 'client-shared-components';

@Component({
  selector: 'aiap-doc-validation-modal-v1',
  templateUrl: './doc-validation-modal-v1.html',
  styleUrls: ['./doc-validation-modal-v1.scss']
})
export class DocValidationModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DocValidationModalV1';
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
    context: {
      user: {
        id: undefined,
        name: undefined,
      },
    },
    doc: {
      id: undefined,
    },
    ruleType: undefined,
  };
  value: any;

  constructor(
    private localePipe: LocalePipe,
  ) {
    super();
    this.value = lodash.cloneDeep(this._value);
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Payload';
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  close() {
    this.isOpen = false;
  }

  show(value: any) {
    _debugW(DocValidationModalV1.getClassName(), `show`, { value });
    if (
      !lodash.isEmpty(value)
    ) {
      this.value = ramda.mergeDeepRight(this._value, value);
    } else {
      this.value = lodash.cloneDeep(this._value);
    }
    if (
      !lodash.isEmpty(this.value.created.date)
    ) {
      this.value.created.date = this.localePipe.transform(this.value.created.date);
    }
    if (
      !lodash.isEmpty(this.value.timestamp)
    ) {
      this.value.timestamp = this.localePipe.transform(this.value.timestamp);
    }
    this.superShow();
  }
}
