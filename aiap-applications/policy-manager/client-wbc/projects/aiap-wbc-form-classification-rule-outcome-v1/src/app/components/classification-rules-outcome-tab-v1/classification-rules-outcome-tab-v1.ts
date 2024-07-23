/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';

import {
  _debugX,
  _error,
} from 'client-shared-utils';

import {
  ClassificationRulesClassificationSaveModalV1
} from '../classification-rules-classification-save-modal-v1/classification-rules-classification-save-modal-v1';

import {
  ClassificationRulesClassificationDeleteModalV1
} from '../classification-rules-classification-delete-modal-v1/classification-rules-classification-delete-modal-v1';

@Component({
  selector: 'aca-classification-rules-outcome-tab-v1',
  templateUrl: './classification-rules-outcome-tab-v1.html',
  styleUrls: ['./classification-rules-outcome-tab-v1.scss']
})
export class ClassificationRulesOutcomeTabV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationRulesOutcomeTabV1';
  }

  @ViewChild('classificationRulesClassificationSaveModalV1') classificationRulesClassificationSaveModalV1: ClassificationRulesClassificationSaveModalV1;
  @ViewChild('classificationRulesClassificationDeleteModalV1') classificationRulesClassificationDeleteModalV1: ClassificationRulesClassificationDeleteModalV1;

  @Output() onClose = new EventEmitter<any>();

  @Input() rule = undefined;

  private _destroyed$: Subject<void> = new Subject();

  constructor() { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleShowOutcomeClassificationDeleteModal(ids: any): void {
    _debugX(ClassificationRulesOutcomeTabV1.getClassName(), 'handleShowOutcomeClassificationDeleteModal', { ids });
    this.classificationRulesClassificationDeleteModalV1.show(ids);
  }

  handleShowOutcomeClassificationSaveModal(event: any = undefined) {
    const RULE_ID = this.rule?.id;
    const CATALOG_ID = event?.value?.id;
    _debugX(ClassificationRulesOutcomeTabV1.getClassName(), 'handleShowOutcomeClassificationSaveModal', { RULE_ID, event });
    this.classificationRulesClassificationSaveModalV1.show(RULE_ID, CATALOG_ID);
  }
}
