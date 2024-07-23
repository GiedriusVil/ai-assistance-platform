/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import * as lodash from 'lodash';
import * as ramda from 'ramda';

import {
  NotificationService,
} from 'carbon-components-angular';

import {
  _debugW,
} from 'client-shared-utils';

import {
  _debugX, _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  WbcLocationServiceV1,
  EventsServiceV1,
  TimezoneServiceV1,
  QueryServiceV1,
} from 'client-shared-services';

import {
  BaseViewWbcV1,
} from 'client-shared-views';

import {
  DEFAULT_TABLE,
  OUTLETS,
} from 'client-utils';

@Component({
  selector: 'aiap-wbc-surveys-view-v1',
  templateUrl: './view.html',
  styleUrls: ['./view.scss']
})
export class SurveysViewV1 extends BaseViewWbcV1 implements OnInit, OnDestroy {

  static getClassName() {
    return 'SurveysViewV1';
  }

  timezone = this.sessionService.getUser().timezone;

  state: any = {
    queryType: DEFAULT_TABLE.SURVEYS.TYPE,
    defaultSort: DEFAULT_TABLE.SURVEYS.SORT,
    assistants: [],
    assistantsSelected: [],
    dateRange: {},
  };

  constructor(
    protected timezoneService: TimezoneServiceV1,
    private eventsService: EventsServiceV1,
    private sessionService: SessionServiceV1,
    private queryService: QueryServiceV1,
    private wbcLocationService: WbcLocationServiceV1,
    protected notificationService: NotificationService
  ) {
    super(notificationService);
  }

  ngOnInit(): void {
    this._refreshAssistantsDropdownList();
    this.queryService.setSort(this.state.queryType, this.state.defaultSort);
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
  }

  outlet = OUTLETS.convInsights;

  _refreshAssistantsDropdownList() {
    this.state.assistants = [];
    this.state.assistantsSelected = [];
    const ASSISTANTS = this.sessionService.getAssistantsByAccessGroup();
    const QUERY = this.queryService.query(this.state.queryType);
    const SELECTED_ASSISTANTS_IDS = ramda.pathOr([], ['filter', 'assistantIds'], QUERY);
    if (
      lodash.isArray(ASSISTANTS) &&
      !lodash.isEmpty(ASSISTANTS)
    ) {
      for (let assistant of ASSISTANTS) {
        if (
          !lodash.isEmpty(assistant?.id) &&
          !lodash.isEmpty(assistant?.name)
        ) {
          const ASSISTANT_ID = ramda.path(['id'], assistant);
          const IS_SELECTED = SELECTED_ASSISTANTS_IDS.includes(ASSISTANT_ID);
          const DROPDOWN_ITEM = {
            content: `${assistant.name}`,
            selected: IS_SELECTED,
            ...assistant
          };
          this.state.assistants.push(DROPDOWN_ITEM);
          if (IS_SELECTED) {
            this.state.assistantsSelected.push(DROPDOWN_ITEM);
          }
        }
      }
    }
  }

  ngOnDestroy() {
    this.superNgOnDestroy();
  }

  ngAfterViewInit() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }


  handleDateRangeChange(range: any) {
    _debugX(SurveysViewV1.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchClearEvent() {
    _debugX(SurveysViewV1.getClassName(), `handleSearchClearEvent`);
    this.queryService.deleteFilterItems(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSearchEvent(event: string = undefined) {
    _debugX(SurveysViewV1.getClassName(), `handleSearchEvent`, { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.SEARCH, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleAssistantSelectionEvent(event) {
    _debugX(SurveysViewV1.getClassName(), 'handleAssistantSelectionEvent', {
      event: event,
      this_state: this.state
    });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.ASSISTANT_IDS, this._selectedAssistantsIds());
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  _selectedAssistantsIds() {
    const RET_VAL = [];
    if (
      lodash.isArray(this.state?.assistantsSelected) &&
      !lodash.isEmpty(this.state?.assistantsSelected)
    ) {
      for (let assistant of this.state?.assistantsSelected) {
        if (
          !lodash.isEmpty(assistant) &&
          assistant.selected
        ) {
          RET_VAL.push(assistant.id);
        }
      }
    }
    return RET_VAL;
  }

  handleSurveysRowClick(survey: any) {
    const NAVIGATION: any = {};
    let id;
    try {
      id = survey?.value?.conversationId;
      NAVIGATION.path = '(convInsights:main-view/surveys-view-v1/transcript-view-v1)';
      NAVIGATION.extras = { queryParams: { id } }
      this.wbcLocationService.navigateToPathByEnvironmentServiceV1(NAVIGATION.path, NAVIGATION.extras);
    } catch (error) {
      _errorX(SurveysViewV1.getClassName(), 'handleConversationRowClick', { error });
      throw error;
    }
  }
}
