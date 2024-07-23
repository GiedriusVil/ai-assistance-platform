/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import { JsonEditorOptions } from 'ang-jsoneditor';

import {
  BaseModal
} from 'client-shared-views';

@Component({
  selector: 'aca-lambda-module-change-view-modal',
  templateUrl: './lambda-module-change-view-modal-v1.html',
  styleUrls: ['./lambda-module-change-view-modal-v1.scss']
})
export class LambdaModuleChangeView extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'LambdaModuleChangeView';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

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

  constructor() {
    super();
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'transaction';
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy() {
    //
  }

  show(transaction: any) {
    _debugX(LambdaModuleChangeView.getClassName(), `show`,
      {
        transaction,
      });

    if (
      !lodash.isEmpty(transaction)
    ) {
      this.transaction = lodash.cloneDeep(transaction);
    } else {
      this.transaction = lodash.cloneDeep(this._transaction);
    }
    this.superShow();
  }
}
