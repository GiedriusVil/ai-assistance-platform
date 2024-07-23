/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, of, catchError, takeUntil } from 'rxjs';

import * as lodash from 'lodash';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
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
  RULE_ACTIONS_CHANGES_MESSAGES_V1,
  RuleActionsChangesServiceV1,
} from 'client-services';

import {
  RuleActionsChangesModalV1,
} from './rule-action-change-modal-v1/rule-action-change-modal-v1';;

@Component({
  selector: 'aiap-wbc-rule-actions-changes-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class RuleActionsChangesViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'RuleActionsChangesViewV1';
  }

  @ViewChild('ruleActionsChangesModal') ruleActionsChangesModal: RuleActionsChangesModalV1;

  _state: any = {
    query: {
      type: DEFAULT_TABLE.RULE_ACTIONS_CHANGES_V1.TYPE,
      sort: DEFAULT_TABLE.RULE_ACTIONS_CHANGES_V1.SORT,
    },
    dateRange: {},
    actions: [],
  };
  state = lodash.cloneDeep(this._state);

  constructor(
    // params-super
    protected notificationService: NotificationService,
    // params-native
    private eventsService: EventsServiceV1,
    private queryService: QueryServiceV1,
    private ruleActionsChangesService: RuleActionsChangesServiceV1,
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this.queryService.setSort(this.state?.query?.type, this.state?.query?.sort);
    const QUERY = this.queryService.query(this.state?.query?.type);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.search = QUERY?.filter?.search;
    _debugW(RuleActionsChangesViewV1.getClassName(), `ngOnInit`, {
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
    _debugW(RuleActionsChangesViewV1.getClassName(), `onActionSelect`, {
      event
    });
  }

  onDocTypeSelect(event: any) {
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DOC_TYPE, event.item?.value);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
    _debugW(RuleActionsChangesViewV1.getClassName(), `onDocTypeSelect`, {
      event
    });
  }

  loadFilterOptions() {
    this.eventsService.loadingEmit(true);
    this.ruleActionsChangesService.loadFilterOptions().pipe(
      catchError(error => this.handleLoadFilterOptionsError(error)),
      takeUntil(this._destroyed$),
    ).subscribe((response: any) => {
      const ACTIONS = response?.actions;
      const ACTION = this.queryService.getFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.ACTION);
      this.setActionState(ACTIONS, ACTION);
      this.eventsService.loadingEmit(false);
    })
  }

  setActionState(actions: any, selected: any) {
    if (
      !lodash.isEmpty(actions) &&
      lodash.isArray(actions)
    ) {
      for (let action of actions) {
        if (action?.value === selected) {
          action.selected = true;
          this.state.selectedAction = action;
          break;
        }
      }
      this.state.actions = actions;
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
      this.state.docTypes = docTypes;
    }
  }


  handleDateRangeChange(range: any) {
    _debugW(RuleActionsChangesViewV1.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  handleShowChangeEvent(event: any) {
    _debugW(RuleActionsChangesViewV1.getClassName(), `handleShowChangeEvent`, { event });
    this.ruleActionsChangesModal.show(event?.value);
  }

  handleSearchEvent(event: any) {
    _debugW(RuleActionsChangesViewV1.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  hanleClearSearchEvent(event: any) {
    _debugW(RuleActionsChangesViewV1.getClassName(), `hanleSearchClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state?.query?.type, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state?.query?.type));
  }

  private handleLoadFilterOptionsError(error: any) {
    _debugW(RuleActionsChangesViewV1.getClassName(), `handleFindManyByQueryError`, { error });
    const NOTIFICATION = RULE_ACTIONS_CHANGES_MESSAGES_V1
      .ERROR
      .LOAD_FILTER_OPTIONS();

    this.notificationService.showNotification(NOTIFICATION);
    this.eventsService.loadingEmit(false);
    return of();
  }

}
