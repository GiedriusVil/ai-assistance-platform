/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { of, Subscription, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as lodash from 'lodash';
import { FILTER_TYPES } from './live-analytics-filter-utils.component';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  QueryServiceV1,
  EventsServiceV1,
} from 'client-shared-services';

import {
  FiltersConfigurationsService,
} from 'client-services';

@Component({
  selector: 'aca-live-analytics-filter',
  templateUrl: './live-analytics-filter.component.html',
  styleUrls: ['./live-analytics-filter.component.scss'],
})
export class LiveAnalyticsFilter implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsFilter';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() filterRef: any;
  @Input() configuration: any;

  filterSubscription: Subscription;
  filter: any;
  _state = {
    query: undefined,
    queryType: undefined,
    error: undefined,
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private filtersService: FiltersConfigurationsService,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
  ) { }

  ngOnInit(): void {
    const DASHBOARD_REF = this.configuration?.ref;
    this.state.queryType = DASHBOARD_REF;
    this.state.query = this.queryService.query(DASHBOARD_REF);
    this.retrieveFilter();
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  retrieveFilter() {
    this.filterSubscription = this.filtersService.findOneByRef(this.filterRef).pipe(
      catchError((error: any) => this.handleRetrieveFilterError(error))
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsFilter.getClassName(), 'retrieveFilter', { response });
      this.filter = response;
      this.addDynamicStateByFilterType(this.filter?.type);
    });
  }

  retrieveFilterPayload(filterRef) {
    this.filtersService.retrieveFilterPayload(filterRef).pipe(
      catchError((error: any) => this.handleRetrieveFilterError(error))
    ).subscribe((response: any) => {
      _debugX(LiveAnalyticsFilter.getClassName(), 'retrieveFilterPayload', { response });
      const QUERY_PARAM_NAME = this.filter?.queryParamName;
      this.state[QUERY_PARAM_NAME].items = response;
      this.refreshSelectionItems();
    });
  }

  handleToggleEvent(event: any) {
    _debugX(LiveAnalyticsFilter.getClassName(), 'handleToggleEvent', { event });
    this.queryService.setFilterItem(this.state.queryType, this.filter?.queryParamName, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchEvent(event: any) {
    _debugX(LiveAnalyticsFilter.getClassName(), `handleSearchChangeEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, this.filter?.queryParamName, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleDropdownSelectionEvent(event: any) {
    _debugX(LiveAnalyticsFilter.getClassName(), `handleDropdownSelectionEvent`, {
      event: event,
      this_state: this.state
    });
    this.queryService.setFilterItem(this.state.queryType, this.filter?.queryParamName, this._selectedDropdownItems());
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent(event: any) {
    _debugX(LiveAnalyticsFilter.getClassName(), `handleSearchConversationClearEvent`, { event });
    this.queryService.deleteFilterItems(this.state.queryType, this.filter?.queryParamName);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  _selectedDropdownItems() {
    const RET_VAL = [];
    const QUERY_PARAM_NAME = this.filter?.queryParamName;
    const SELECTED_DROPDOWN_ITEMS = this.state?.[QUERY_PARAM_NAME]?.selected;
    if (
      lodash.isArray(SELECTED_DROPDOWN_ITEMS) &&
      !lodash.isEmpty(SELECTED_DROPDOWN_ITEMS)
    ) {
      for (let item of SELECTED_DROPDOWN_ITEMS) {
        if (
          !lodash.isEmpty(item) &&
          item.selected
        ) {
          RET_VAL.push(item);
        }
      }
    }
    return RET_VAL;
  }

  addDynamicStateByFilterType(type) {
    const QUERY_PARAM_NAME = this.filter?.queryParamName;
    const QUERY_FILTER_BY_QUERY_PARAM_NAME = this.state.query?.filter[QUERY_PARAM_NAME];
    switch (type) {
      case FILTER_TYPES.Dropdown:
        this.state[QUERY_PARAM_NAME] = {};
        this.state[QUERY_PARAM_NAME].items = [];
        this.state[QUERY_PARAM_NAME].selected = QUERY_FILTER_BY_QUERY_PARAM_NAME ? QUERY_FILTER_BY_QUERY_PARAM_NAME : [];
        this.retrieveFilterPayload(this.filterRef);
        break;
      case FILTER_TYPES.Toggle:
        this.state[QUERY_PARAM_NAME] = QUERY_FILTER_BY_QUERY_PARAM_NAME ? true : false;
        break;
      case FILTER_TYPES.SearchBar:
        this.state[QUERY_PARAM_NAME] = QUERY_FILTER_BY_QUERY_PARAM_NAME ? QUERY_FILTER_BY_QUERY_PARAM_NAME : '';
        break;
      default:
        break;
    }
  }

  private refreshSelectionItems() {
    const QUERY_PARAM_NAME = this.filter?.queryParamName;
    const SELECTED_ITEMS = this.state?.[QUERY_PARAM_NAME]?.selected;
    const ITEMS = this.state?.[QUERY_PARAM_NAME]?.items;
    if (!lodash.isEmpty(ITEMS)) {
      for (let item of ITEMS) {
        const ITEM_CONTENT = item?.content;
        const IS_SELECTED = SELECTED_ITEMS.includes(ITEM_CONTENT);
        if (
          IS_SELECTED
        ) {
          item.selected = IS_SELECTED;
        }
      }
    }
  }

  private handleRetrieveFilterError(error: any) {
    _errorX(LiveAnalyticsFilter.getClassName(), 'handleRetrieveFilterError', { error });
    const NEW_STATE = lodash.cloneDeep(this.state);
    NEW_STATE.error = error;
    this.state = NEW_STATE;
    return of();
  }

}
