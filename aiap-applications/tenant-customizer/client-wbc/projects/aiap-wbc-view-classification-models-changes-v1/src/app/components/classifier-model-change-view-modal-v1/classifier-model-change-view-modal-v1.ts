/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

import {
  JsonEditorOptions,
} from 'ang-jsoneditor';

import {
  BaseModal,
} from 'client-shared-views';

@Component({
  selector: 'aiap-classifier-model-change-view-modal-v1',
  templateUrl: './classifier-model-change-view-modal-v1.html',
  styleUrls: ['./classifier-model-change-view-modal-v1.scss']
})
export class ClassifierModelChangeViewModalV1 extends BaseModal implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'ClassifierModelChangeViewModalV1';
  }

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  _transaction: any = {
    id: null,
    doc: null,
    docId: null,
    docType: null,
    docChanges: null,
    action: null,
    created: {
      user: {
        id: null,
        name: null,
      },
    }
  };
  transaction = lodash.cloneDeep(this._transaction);

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
    _debugX(ClassifierModelChangeViewModalV1.getClassName(), `show`,
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
