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
  CLASSIFICATION_RULES_EXTERNAL_CLASSIFICATIONS_MESSAGES,
  appendToStateClassificationCombobox,
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
  ClassificationRulesClassificationsExternalService,
} from 'client-services';

@Component({
  selector: 'aca-external-classification-segment-combobox',
  templateUrl: './segment-combobox.comp.html',
  styleUrls: ['./segment-combobox.comp.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ExternalClassificationSegmentCombobox extends BaseCombobox implements OnInit, OnChanges {

  static getClassName() {
    return 'ExternalClassificationSegmentCombobox';
  }

  @ViewChild('segmentCombobox') public combobox: ComboBox;

  configs: any = {
    size: 'md',
    label: 'Segment',
    helperText: 'Select Segment',
    invalidText: 'Invalid',
    theme: 'dark',
  }

  _queryState: any = {
    searching: false,
    loading: false,
    totalItems: 1,
    pageSize: 10,
    page: 1,
    queryType: EXTERNAL_QUERIES.CLASSIFICATION_RULES_SEGMENT.TYPE,
  }

  public queryState: any = lodash.cloneDeep(this._queryState);

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
    _debugX(ExternalClassificationSegmentCombobox.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_value: this.value,
      this_state: this.state,
      this_queryState: this.queryState
    });
    const NEW_STATE = lodash.cloneDeep(this.state);
    appendToStateClassificationCombobox(NEW_STATE, NEW_STATE.itemsRaw, this.value);

    this.state = NEW_STATE;
  }

  protected loadItems() {
    this.queryService.setPagination(this.queryState.queryType, { page: this.queryState.page, size: this.queryState.pageSize })
    const QUERY = this.queryService.query(this.queryState.queryType);
    _debugX(ExternalClassificationSegmentCombobox.getClassName(), 'loadItems', { QUERY });
    this.eventsService.loadingEmit(true);
    this.queryState.loading = true;
    this.classificationRulesClassificationsExternalService.findManySegmentsByQuery(QUERY)
      .pipe(
        catchError(error => this.handleFindManyByQueryError(error)),
        takeUntil(this._destroyed$),
      ).subscribe((response: any) => {
        _debugX(ExternalClassificationSegmentCombobox.getClassName(), 'loadItems', { response, this_state: this.state });
        this.queryState.totalItems = response?.total;
        this.eventsService.loadingEmit(false);
        this.updateState(response?.items);
        this.queryState.loading = false;
      });
  }

  public addCurrentToSelections() {
    if (!lodash.isEmpty(this.value?.id)) {
      this.state.itemsRaw.push(this.value);
      appendToStateClassificationCombobox(this.state, this.state.itemsRaw, this.value, !this.queryState.searching);
    }
  }

  private updateState(items) {
    const NEW_STATE = lodash.cloneDeep(this._state);
    NEW_STATE.itemsRaw = uniqueMergedArray(this.state.itemsRaw, items)
    appendToStateClassificationCombobox(NEW_STATE, NEW_STATE.itemsRaw, this.value, !this.queryState.searching);
    this.state = NEW_STATE;
  }

  private handleFindManyByQueryError(error: any) {
    _debugX(ExternalClassificationSegmentCombobox.getClassName(), 'handleSubmitEvent', { error });
    const NOTIFICATION = CLASSIFICATION_RULES_EXTERNAL_CLASSIFICATIONS_MESSAGES.ERROR.FIND_MANY_SEGMENTS_BY_QUERY;
    this.notificationService.showNotification(NOTIFICATION);
    this.queryState.loading = false;
    return of();
  }
}
