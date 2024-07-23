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
  CATALOG_RULES_EXTERNAL_CATALOGS_MESSAGES,
  appendToStateCatalogs,
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
  CatalogRulesExternalCatalogsService,
} from 'client-services';

@Component({
  selector: 'aca-external-catalogs-combobox',
  templateUrl: './external-catalogs-combobox.comp.html',
  styleUrls: ['./external-catalogs-combobox.comp.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ExternalCatalogsCombobox extends BaseCombobox implements OnInit, OnChanges {

  static getClassName() {
    return 'ExternalCatalogsCombobox';
  }

  @ViewChild('catalogsCombobox') public combobox: ComboBox;

  configs: any = {
    size: 'md',
    label: 'Catalog',
    helperText: 'Select catalog',
    invalidText: 'Invalid',
    theme: 'dark',
  }

  _queryState: any = {
    searching: false,
    loading: false,
    totalItems: 1,
    pageSize: 10,
    page: 0,
    queryType: EXTERNAL_QUERIES.CATALOG_RULES_CATALOGS.TYPE,
  }

  queryState: any = lodash.cloneDeep(this._queryState);

  constructor(
    private eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    private catalogRulesExternalCatalogsService: CatalogRulesExternalCatalogsService,
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
    _debugX(ExternalCatalogsCombobox.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    appendToStateCatalogs(NEW_STATE, NEW_STATE.itemsRaw, this.value);
    this.state = NEW_STATE;
  }

  public addCurrentToSelections() {
    if (!lodash.isEmpty(this.value?.id)) {
      this.state.itemsRaw.push(this.value);
      appendToStateCatalogs(this.state, this.state.itemsRaw, this.value, !this.queryState.searching);
    }
  }

  protected loadItems() {
    this.queryService.setPagination(this.queryState.queryType, { page: this.queryState.page, size: this.queryState.pageSize })
    const QUERY = this.queryService.query(this.queryState.queryType);
    _debugX(ExternalCatalogsCombobox.getClassName(), 'loadItems', { type: this.queryState.queryType, QUERY, state: this.state, qstate: this.queryState });
    this.eventsService.loadingEmit(true);
    this.queryState.loading = true;
    this.catalogRulesExternalCatalogsService.findManyByQuery(QUERY)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ExternalCatalogsCombobox.getClassName(), 'loadItems', { response });
        this.queryState.totalItems = response?.total;
        this.eventsService.loadingEmit(false);
        this.updateState(response?.items)
        this.queryState.loading = false;
      });
  }

  private updateState(items) {
    const NEW_STATE = lodash.cloneDeep(this._state);
    NEW_STATE.itemsRaw = uniqueMergedArray(this.state.itemsRaw, items)
    appendToStateCatalogs(NEW_STATE, NEW_STATE.itemsRaw, this.value, !this.queryState.searching);
    this.state = NEW_STATE;
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(ExternalCatalogsCombobox.getClassName(), 'handleSubmitEvent', { error });
    const NOTIFICATION = CATALOG_RULES_EXTERNAL_CATALOGS_MESSAGES.ERROR.FIND_MANY_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    this.queryState.loading = false;
    return of();
  }

}
