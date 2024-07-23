/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugW,
} from 'client-shared-utils';

import {
  BaseModalV1,
} from 'client-shared-views';

import { LocalePipe } from 'client-shared-components';

import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'aiap-rule-change-modal-v1',
  templateUrl: './rule-change-modal-v1.html',
  styleUrls: ['./rule-change-modal-v1.scss']
})
export class RuleChangeModalV1 extends BaseModalV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'RuleChangeModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  isOpen = false;

  _transaction: any = {
    id: undefined,
    doc: undefined,
    docId: undefined,
    docType: undefined,
    docChanges: undefined,
    action: undefined,
    context: {
      user: {
        id: undefined,
        username: undefined
      }
    },
    timestamp: undefined,
  };
  transaction = lodash.cloneDeep(this._transaction);


  changesTooltip = `\`
  kind - indicates the kind of change; will be one of the following:
    N - indicates a newly added property/element
    D - indicates a property/element was deleted
    E - indicates a property/element was edited
    A - indicates a change occurred within an array\`
  `;

  constructor(
    private localePipe: LocalePipe
  ) {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'transaction';
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  close() {
    this.isOpen = false;
  }

  show(transaction: any) {
    _debugW(RuleChangeModalV1.getClassName(), `show`, { transaction });
    if (
      !lodash.isEmpty(transaction)
    ) {
      this.transaction = this._sanitizeTransaction(transaction)
    } else {
      this.transaction = lodash.cloneDeep(this._transaction);
    }
    this.isOpen = true;
  }

  _sanitizeTransaction(transaction: any) {
    const RET_VAL = lodash.cloneDeep(transaction);
    RET_VAL.timestamp = this.localePipe.transform(transaction.timestamp);

    return RET_VAL;
  }
}
