/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { NotificationService } from 'carbon-components-angular';

import {
  appendToStateSuppliers,
  BaseModal,
  DEFAULT_TABLE,
  BUY_RULES_SUPPLIERS_MESSAGES,
} from 'client-utils';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
  BuyRulesSuppliersService,
} from 'client-services';
import { ExternalSuppliersCombobox } from 'client-components';

@Component({
  selector: 'aca-buy-rules-suppliers-save-modal',
  templateUrl: './buy-rules-suppliers-save.modal.html',
  styleUrls: ['./buy-rules-suppliers-save.modal.scss']
})
export class BuyRulesSuppliersSaveModal extends BaseModal implements OnInit, OnDestroy {

  static getClassName() {
    return 'BuyRulesSuppliersSaveModal';
  }

  isEditable: boolean = true;

  @ViewChild('suppliersCombobox') suppliersCombobox: ExternalSuppliersCombobox;

  queryType = DEFAULT_TABLE.BUY_RULES_SUPPLIERS.TYPE;

  _value = {
    id: undefined,
    ruleId: undefined,
    priority: 1000,
    external: {
      id: undefined,
      name: undefined,
    },
  }

  value = lodash.cloneDeep(this._value);


  constructor(
    private notificationService: NotificationService,
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private buyRulesSuppliersService: BuyRulesSuppliersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  loadSaveModalData(ruleId: any, id: any) {
    _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'loadModalData', { ruleId, id });
    this.eventsService.loadingEmit(true);
    this.buyRulesSuppliersService.loadSaveModalData(id)
      .pipe(
        catchError((error) => this.hanldeLoadSaveModalDataError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'loadSaveModalData', { response });
        let newValue: any = this.ensureNonEmptyValue(response?.value, this._value);
        newValue.ruleId = ruleId;
        this.value = newValue;
        this.suppliersCombobox.prepareCombobox(this.value?.external);
        this.eventsService.loadingEmit(false);
        this.superShow();
      });
  }

  handleSaveClickEvent(event: any) {
    const SANITIZED_VALUE = this.sanitizedValue();
    _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'handleSaveClickEvent', { SANITIZED_VALUE, event });
    this.eventsService.loadingEmit(true);
    this.buyRulesSuppliersService.saveOne(SANITIZED_VALUE)
      .pipe(
        catchError((error) => this.handleSaveOneError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'handleSaveClickEvent', { response, });
        this.eventsService.loadingEmit(false);

        const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.SUCCESS.SAVE_ONE;
        this.notificationService.showNotification(NOTIFICATION);
        this.close();
        this.refreshBuyRulesSuppliers();
      });
  }

  show(ruleId: any, id: any) {
    if (!lodash.isEmpty(ruleId)) {
      this.loadSaveModalData(ruleId, id);
    } else {
      const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.ERROR.SHOW_SAVE_MODAL;
      this.notificationService.showNotification(NOTIFICATION);
    }
  }

  refreshBuyRulesSuppliers(): void {
    this.eventsService.buyRuleSuppliersEmit(this.queryService.query(this.queryType));
  }

  private sanitizedValue() {
    const RET_VAL = lodash.cloneDeep(this.value);
    _errorX(BuyRulesSuppliersSaveModal.getClassName(), 'sanitizedValue', {
      this_value: this.value,
      RET_VAL: RET_VAL,
    });
    return RET_VAL;
  }

  private handleSaveOneError(error: any) {
    _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'handleSaveOneError', { error });
    const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.ERROR.SAVE_ONE;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

  private hanldeLoadSaveModalDataError(error: any) {
    _debugX(BuyRulesSuppliersSaveModal.getClassName(), 'hanldeLoadSaveModalDataError', { error });
    const NOTIFICATION = BUY_RULES_SUPPLIERS_MESSAGES.ERROR.LOAD_SAVE_MODAL_DATA;
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

}
