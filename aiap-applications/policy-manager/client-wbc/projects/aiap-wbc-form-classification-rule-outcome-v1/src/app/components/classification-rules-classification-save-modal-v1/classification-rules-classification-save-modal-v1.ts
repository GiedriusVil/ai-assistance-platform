/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotificationService } from 'carbon-components-angular';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of, defaultIfEmpty, mergeMap, forkJoin } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  DEFAULT_TABLE,
  CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES,
  BaseModal,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  ClassificationRulesClassificationsService,
} from 'client-services';


import {
  ExternalClassificationSegmentCombobox
} from 'client-components';

@Component({
  selector: 'aca-classification-rules-classification-save-modal-v1',
  templateUrl: './classification-rules-classification-save-modal-v1.html',
  styleUrls: ['./classification-rules-classification-save-modal-v1.scss']
})
export class ClassificationRulesClassificationSaveModalV1 extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassificationRulesClassificationSaveModalV1';
  }

  @Output() onAddNewClassificationRuleClassification = new EventEmitter<any>();

  @ViewChild('segmentComboBox') segmentComboBox: ExternalClassificationSegmentCombobox
  queryType = DEFAULT_TABLE.CLASSIFICATION_RULE_CLASSIFICATIONS.TYPE;

  _value = {
    id: undefined,
    ruleId: undefined,
    external: {
      id: undefined,
      segment: undefined,
      family: undefined,
      class: undefined,
      commodity: undefined
    },
  }

  value = lodash.cloneDeep(this._value);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private classificationRulesClassificationsService: ClassificationRulesClassificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    super.superNgOnDestroy();
  }

  loadSaveModalData(ruleId: any, id: any) {
    _debugX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'loadSaveModalData', { ruleId, id });
    tap(() => this.eventsService.loadingEmit(true)),
      this.classificationRulesClassificationsService.loadSaveModalData(id).pipe(
        catchError((error: any) => this.handleLoadSaveModalDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'loadSaveModalData', { response });
        let value;
        if (
          lodash.isEmpty(response?.value)
        ) {
          value = lodash.cloneDeep(this._value);
        } else {
          value = lodash.cloneDeep(response?.value);
        }
        value.ruleId = ruleId;
        this.value = value;
        this.eventsService.loadingEmit(false);
        this.segmentComboBox.prepareCombobox(this.value.external.segment);
        this.superShow();
      });
  }

  handleSaveClickEvent(event: any) {
    const SANITIZED_VALUE = this.sanitizedValue();
    _debugX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'handleSaveClickEvent', { event, SANITIZED_VALUE });
    this.eventsService.loadingEmit(true);
    this.classificationRulesClassificationsService.saveOne(SANITIZED_VALUE).pipe(
      catchError((error) => this.handleSaveOneError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response) => {
      this.eventsService.loadingEmit(false);


      const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.SUCCESS.SAVE_ONE;
      this.notificationService.showNotification(NOTIFICATION);
      this.onAddNewClassificationRuleClassification.emit(ramda.path(["id"], response));
      this.close();
      this.refreshClassificationRulesClassifications();
      _debugX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'saveClassificationRulesClassification', { response });
    });
  }

  show(ruleId: any, id: any) {
    if (
      !lodash.isEmpty(ruleId)
    ) {
      this.loadSaveModalData(ruleId, id);
    } else {
      const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.ERROR.SHOW_CLASSIFICATION_RULE_CLASSIFICATION_SAVE_MODAL;
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  refreshClassificationRulesClassifications(): void {
    this.eventsService.classificationRuleClassificationsEmit(this.queryService.query(this.queryType));
  }

  private handleLoadSaveModalDataError(error) {
    _errorX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'handleLoadSaveModalDataError', { error });
    const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.ERROR.LOAD_SAVE_MODAL_DATA;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleSaveOneError(error: any) {
    _errorX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'handleSaveOneError', { error });
    const NOTIFICATION = CLASSIFICATION_RULES_CLASSIFICATIONS_MESSAGES.ERROR.SAVE_ONE;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private sanitizedValue() {
    let retVal = lodash.cloneDeep(this.value);
    _errorX(ClassificationRulesClassificationSaveModalV1.getClassName(), 'sanitizedValue', {
      this_value: this.value,
      retVal: retVal
    });
    return retVal;
  }
}
