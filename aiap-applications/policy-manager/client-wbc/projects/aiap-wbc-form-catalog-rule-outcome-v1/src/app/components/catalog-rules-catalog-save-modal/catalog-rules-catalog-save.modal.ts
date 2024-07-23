/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { catchError, takeUntil, } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  BaseModal,
  DEFAULT_TABLE,
  CATALOG_RULES_CATALOGS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  CatalogRulesCatalogsService,
} from 'client-services';
import { ExternalCatalogsCombobox } from 'client-components';

@Component({
  selector: 'aca-catalog-rules-catalog-save-modal',
  templateUrl: './catalog-rules-catalog-save.modal.html',
  styleUrls: ['./catalog-rules-catalog-save.modal.scss']
})
export class CatalogRulesCatalogSaveModal extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'CatalogRulesCatalogSaveModal';
  }

  @ViewChild('catalogsCombobox') catalogsCombobox: ExternalCatalogsCombobox;

  queryType = DEFAULT_TABLE.CATALOG_RULE_CATALOGS.TYPE;


  _value = {
    id: undefined,
    ruleId: undefined,
    external: {
      id: undefined,
      name: undefined,
      supplier: {
        id: undefined,
        name: undefined,
      }
    },
  }

  value = lodash.cloneDeep(this._value);

  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private catalogRulesCatalogsService: CatalogRulesCatalogsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  loadModalData(ruleId: any, id: any) {
    _debugX(CatalogRulesCatalogSaveModal.getClassName(), 'loadModalData', { ruleId, id });
    this.eventsService.loadingEmit(true);
    this.catalogRulesCatalogsService.loadSaveModalData(id).pipe(
      catchError((error: any) => this.handleLoadSaveModalDataError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      _debugX(CatalogRulesCatalogSaveModal.getClassName(), 'loadModalData', { response });
      let value: any;
      if (
        lodash.isEmpty(response?.value)
      ) {
        value = lodash.cloneDeep(this._value);
      } else {
        value = lodash.cloneDeep(response?.value);
      }
      value.ruleId = ruleId;
      this.value = value;
      this.catalogsCombobox.prepareCombobox(this.value?.external);
      this.eventsService.loadingEmit(false);
      this.superShow();
    });
  }

  handleSaveClickEvent(event: any) {
    const SANITIZED_VALUE = this.sanitizedValue();
    _debugX(CatalogRulesCatalogSaveModal.getClassName(), 'handleSaveClickEvent', { event, SANITIZED_VALUE });
    this.eventsService.loadingEmit(true);
    this.catalogRulesCatalogsService.saveOne(SANITIZED_VALUE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response) => {
        _debugX(CatalogRulesCatalogSaveModal.getClassName(), 'handleSaveClickEvent', { response });
        this.eventsService.loadingEmit(false);
        const NOTIFICATION = CATALOG_RULES_CATALOGS_MESSAGES.SUCCESS.SAVE_ONE;
        this.notificationService.showNotification(NOTIFICATION);
        this.close();
        this.refreshCatalogRulesCatalogs();
      });
  }

  show(ruleId: any, id: any) {
    if (!lodash.isEmpty(ruleId)) {
      this.loadModalData(ruleId, id);
    } else {
      const NOTIFICATION = CATALOG_RULES_CATALOGS_MESSAGES.ERROR.SHOW_CATALOG_RULE_CATALOG_SAVE_MODAL;
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  refreshCatalogRulesCatalogs(): void {
    this.eventsService.catalogRuleCatalogsEmit(this.queryService.query(this.queryType));
  }

  private handleLoadSaveModalDataError(error) {
    _errorX(CatalogRulesCatalogSaveModal.getClassName(), 'handleLoadSaveModalDataError', { error });
    const NOTIFICATION = CATALOG_RULES_CATALOGS_MESSAGES.ERROR.LOAD_SAVE_MODAL_DATA;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private handleSaveOneError(error: any) {
    _errorX(CatalogRulesCatalogSaveModal.getClassName(), 'handleSaveOneError', { error });
    const NOTIFICATION = CATALOG_RULES_CATALOGS_MESSAGES.ERROR.SAVE_ONE;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private sanitizedValue() {
    let retVal = lodash.cloneDeep(this.value);
    _errorX(CatalogRulesCatalogSaveModal.getClassName(), 'sanitizedValue', {
      this_value: this.value,
      retVal: retVal
    });
    return retVal;
  }
}
