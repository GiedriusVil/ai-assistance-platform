/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { catchError, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lodash from 'lodash';

import { ComboBox, NotificationService } from 'carbon-components-angular';

import {
  EXTERNAL_QUERIES,
  BUY_RULES_EXTERNAL_SUPPLIERS_MESSAGES,
  appendToStateSuppliers,
  BaseCombobox,
} from 'client-utils';

import {
  _debugX,
  _errorX,
  uniqueMergedArray,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
  BuyRulesExternalSuppliersService,
} from 'client-services';

@Component({
  selector: 'aca-external-suppliers-combobox',
  templateUrl: './external-suppliers-combobox.comp.html',
  styleUrls: ['./external-suppliers-combobox.comp.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ExternalSuppliersCombobox extends BaseCombobox implements OnInit, OnChanges {

  static getClassName() {
    return 'ExternalSuppliersCombobox';
  }

  @ViewChild('suppliersCombobox') public combobox: ComboBox;

  configs: any = {
    size: 'md',
    label: 'Supplier',
    helperText: 'Select supplier',
    invalidText: 'Invalid',
    theme: 'dark',
  }

  _queryState: any = {
    searching: false,
    loading: false,
    totalItems: 1,
    pageSize: 10,
    page: 0,
    queryType: EXTERNAL_QUERIES.BUY_RULES_SUPPLIERS.TYPE,
  }

  queryState: any = lodash.cloneDeep(this._queryState);

  constructor(
    private eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    private buyRulesExternalSuppleirsService: BuyRulesExternalSuppliersService,
  ) {
    super(queryService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(ExternalSuppliersCombobox.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    appendToStateSuppliers(NEW_STATE, NEW_STATE.itemsRaw, this.value);
    this.state = NEW_STATE;
  }

  public addCurrentToSelections() {
    if (!lodash.isEmpty(this.value?.id)) {
      this.state.itemsRaw.push(this.value);
      appendToStateSuppliers(this.state, this.state.itemsRaw, this.value, !this.queryState.searching);
    }
  }

  protected loadItems() {
    this.queryService.setPagination(this.queryState.queryType, { page: this.queryState.page, size: this.queryState.pageSize })
    const QUERY = this.queryService.query(this.queryState.queryType);
    _debugX(ExternalSuppliersCombobox.getClassName(), 'loadItems', { QUERY });
    this.eventsService.loadingEmit(true);
    this.queryState.loading = true;
    this.buyRulesExternalSuppleirsService.findManyByQuery(QUERY)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ExternalSuppliersCombobox.getClassName(), 'loadItems', { response });
        this.queryState.totalItems = response?.total;
        this.eventsService.loadingEmit(false);
        this.updateState(response?.items);
        this.queryState.loading = false;
      });
  }

  private updateState(items) {
    const NEW_STATE = lodash.cloneDeep(this._state);
    NEW_STATE.itemsRaw = uniqueMergedArray(this.state.itemsRaw, items)
    appendToStateSuppliers(NEW_STATE, NEW_STATE.itemsRaw, this.value, !this.queryState.searching);
    this.state = NEW_STATE;
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(ExternalSuppliersCombobox.getClassName(), 'handleSubmitEvent', { error });
    const NOTIFICATION = BUY_RULES_EXTERNAL_SUPPLIERS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    this.queryState.loading = false;
    return of();
  }

}
