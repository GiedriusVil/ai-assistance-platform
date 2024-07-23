/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { catchError, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { of } from 'rxjs';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import { NotificationService } from 'carbon-components-angular';

import {
  _debugX,
  _errorX,
  uniqueMergedArray,
} from 'client-shared-utils';


import {
  EXTERNAL_QUERIES,
  CLASSIFICATION_RULES_EXTERNAL_CLASSIFICATIONS_MESSAGES,
  appendToStateClassificationCombobox,
  BaseCombobox,
} from 'client-utils';


import {
  QueryServiceV1,
  EventsServiceV1,
  ClassificationRulesClassificationsExternalService,
} from 'client-services';

@Component({
  selector: 'aca-external-classification-commodity-combobox',
  templateUrl: './commodity-combobox.comp.html',
  styleUrls: ['./commodity-combobox.comp.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ExternalClassificationCommodityCombobox extends BaseCombobox implements OnInit, OnChanges {

  static getClassName() {
    return 'ExternalClassificationCommodityCombobox';
  }

  @Input() segment;
  @Input() family;
  @Input() class;

  configs: any = {
    size: 'md',
    label: 'Commodity',
    helperText: 'Select commodity',
    invalidText: 'Invalid',
    theme: 'dark',
  }

  _queryState: any = {
    searching: false,
    loading: false,
    totalItems: 1,
    pageSize: 10,
    page: 1,
    queryType: EXTERNAL_QUERIES.CLASSIFICATION_RULES_COMMODITY.TYPE,
  }

  queryState: any = lodash.cloneDeep(this._queryState);

  constructor(
    private eventsService: EventsServiceV1,
    protected queryService: QueryServiceV1,
    private notificationService: NotificationService,
    private classificationRulesClassificationsExternalService: ClassificationRulesClassificationsExternalService,
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
    _debugX(ExternalClassificationCommodityCombobox.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    appendToStateClassificationCombobox(NEW_STATE, NEW_STATE.itemsRaw, this.value);
    this.state = NEW_STATE;

    this.handleHigherClassificationValueChange(changes?.segment, QueryServiceV1.FILTER_KEY.SEGMENT_ID, changes?.value);
    this.handleHigherClassificationValueChange(changes?.family, QueryServiceV1.FILTER_KEY.FAMILY_ID, changes?.value);
    this.handleHigherClassificationValueChange(changes?.class, QueryServiceV1.FILTER_KEY.CLASS_ID, changes?.value, true);
  }

  private handleHigherClassificationValueChange(classification, filterKey, valueChanges, loadData = false) {
    if (!lodash.isEqual(classification?.currentValue, classification?.previousValue)) {
      this.queryService.setFilterItem(this.queryState.queryType, filterKey, classification?.currentValue?.id);
      if (!valueChanges) {
        this.value = undefined;
        this.valueChange.emit();
      }
      if (loadData) {
        this.loadData(this.value);
      }
    }
  }

  public addCurrentToSelections() {
    if (!lodash.isEmpty(this.value?.id)) {
      this.state.itemsRaw.push(this.value);
      appendToStateClassificationCombobox(this.state, this.state.itemsRaw, this.value, !this.queryState.searching);
    }
  }

  protected loadItems() {
    if (!this.segment || !this.family || !this.class) return;
    this.queryService.setPagination(this.queryState.queryType, { page: this.queryState.page, size: this.queryState.pageSize })
    const QUERY = this.queryService.query(this.queryState.queryType);
    _debugX(ExternalClassificationCommodityCombobox.getClassName(), 'loadItems', { QUERY });
    this.eventsService.loadingEmit(true);
    this.queryState.loading = true;
    this.classificationRulesClassificationsExternalService.findManyCommoditiesByQuery(QUERY)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ExternalClassificationCommodityCombobox.getClassName(), 'loadItems', { response });
        this.queryState.totalItems = response?.total;
        this.eventsService.loadingEmit(false);
        this.updateState(response?.items)
        this.queryState.loading = false;
      });
  }

  private updateState(items) {
    const NEW_STATE = lodash.cloneDeep(this._state);
    NEW_STATE.itemsRaw = uniqueMergedArray(this.state.itemsRaw, items)
    appendToStateClassificationCombobox(NEW_STATE, NEW_STATE.itemsRaw, this.value, !this.queryState.searching);
    this.state = NEW_STATE;
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(ExternalClassificationCommodityCombobox.getClassName(), 'handleSubmitEvent', { error });
    const NOTIFICATION = CLASSIFICATION_RULES_EXTERNAL_CLASSIFICATIONS_MESSAGES.ERROR.FIND_MANY_COMMODITIES_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    this.queryState.loading = false;
    return of();
  }

}
