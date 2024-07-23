/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { Subject, of, catchError, takeUntil } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  EventsServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
} from 'client-utils';

import {
  DOC_VALIDATIONS_MESSAGES_V2,
  DocValidationsServiceV2,
} from 'client-services';

import { DocValidationModalV2 } from './doc-validation-modal-v2/doc-validation-modal-v2';

@Component({
  selector: 'aiap-wbc-doc-validations-view-v2',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class DocValidationsViewV2 extends BaseViewWbcV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'DocValidationsViewV2';
  }

  @ViewChild('docValidationModal') docValidationModal: DocValidationModalV2;

  _state: any = {
    dateRange: {},
    actions: [],
    ruleTypes: [],
    query: {
      type: DEFAULT_TABLE.DOC_VALIDATIONS_V2.TYPE,
      sort: DEFAULT_TABLE.DOC_VALIDATIONS_V2.SORT,
    }
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private docValidationsService: DocValidationsServiceV2,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    const QUERY = this.queryService.query(this.state?.query?.type);

    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;

    _debugW(DocValidationsViewV2.getClassName(), `ngOnInit`, {
      query: QUERY,
      this_state: this.state
    });

    this.loadFilterOptions();
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  onActionSelect(event: any) {
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.ACTION, event.item?.value);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    _debugW(DocValidationsViewV2.getClassName(), `onActionSelect`, {
      event
    });
  }

  onRuleTypeSelect(event: any) {
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.RULE_TYPE, event.item?.value);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    _debugW(DocValidationsViewV2.getClassName(), `onRuleTypeSelect`, {
      event
    });
  }

  onDocTypeSelect(event: any) {
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DOC_TYPE, event.item?.value);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    _debugW(DocValidationsViewV2.getClassName(), `onDocTypeSelect`, {
      event
    });
  }

  loadFilterOptions() {
    this.eventsService.loadingEmit(true);
    this.docValidationsService.loadFilterOptions().pipe(
      catchError(error => this.handleLoadFilterOptionsError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {

      const ACTIONS = response?.actions;
      const RULE_TYPES = response?.ruleTypes;
      const ACTION = this.queryService.getFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.ACTION);
      const RULE_TYPE = this.queryService.getFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.RULE_TYPE);

      this.setSelected(ACTIONS, ACTION);
      this.setSelected(RULE_TYPES, RULE_TYPE);
      this.state.actions = ACTIONS;
      this.state.ruleTypes = RULE_TYPES;
      this.eventsService.loadingEmit(false);
    })
  }

  setSelected(selections, selected) {
    if (
      !lodash.isEmpty(selections) &&
      lodash.isArray(selections)
    ) {
      for (let selection of selections) {
        if (selection?.value === selected) {
          selection.selected = true;
          break;
        }
      }
    }
  }

  setDocTypeState(docTypes: any, selected: any) {
    if (
      !lodash.isEmpty(docTypes) &&
      lodash.isArray(docTypes)
    ) {
      for (let docType of docTypes) {
        if (docType?.value === selected) {
          docType.selected = true;
          this.state.selectedDocType = docType;
          break;
        }
      }
    }
  }

  handleDateRangeChange(range: any) {
    _debugW(DocValidationsViewV2.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowChangeEvent(event: any) {
    _debugW(DocValidationsViewV2.getClassName(), `handleShowChangeEvent`, { event });
    this.docValidationModal.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugW(DocValidationsViewV2.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  hanleClearSearchEvent(event: any) {
    _debugW(DocValidationsViewV2.getClassName(), `hanleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  private handleLoadFilterOptionsError(error: any) {
    _debugW(DocValidationsViewV2.getClassName(), `handleFindManyByQueryError`, { error });
    const NOTIFICATION = DOC_VALIDATIONS_MESSAGES_V2.ERROR.LOAD_FILTER_OPTIONS();
    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

}
