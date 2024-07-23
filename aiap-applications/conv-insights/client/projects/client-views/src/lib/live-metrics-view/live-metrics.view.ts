/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, Observable, of, Subject } from 'rxjs';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  BaseView
} from 'client-shared-views';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  EventsServiceV1,
  QueryServiceV1,
  NotificationServiceV2,
} from 'client-shared-services';

import {
  DEFAULT_TABLE,
  ANALYTICS_LIVE_MESSAGES,
  OUTLETS,
} from 'client-utils';

import {
  LiveAnalyticsConfigurationsService,
} from 'client-services';

@Component({
  selector: 'aca-live-metrics-view',
  templateUrl: './live-metrics.view.html',
  styleUrls: ['./live-metrics.view.scss'],
})
export class LiveMetricsView extends BaseView implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveMetricsView';
  }

  _cancelMetricsRequests$: Subject<void> = new Subject();

  outlet = OUTLETS.convInsights;

  _state = {
    configuration: undefined,
    query: undefined,
    queryType: DEFAULT_TABLE.LIVE_METRICS.TYPE,
    dateRange: {},
    assistants: [],
    assistantsSelected: [],
    isSystemMessagesVisible: undefined,
  }

  state: any = lodash.cloneDeep(this._state);

  constructor(
    private eventsService: EventsServiceV1,
    private liveAnalyticsConfigurationsService: LiveAnalyticsConfigurationsService,
    private notificationService: NotificationServiceV2,
    private sessionService: SessionServiceV1,
    private queryService: QueryServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this._refreshAssistantsDropdownList();
    const QUERY = this.queryService.query(this.state.queryType);
    this.state.dateRange = QUERY?.filter?.dateRange;
    this.state.isSystemMessagesVisible = QUERY?.filter?.isSystemMessagesVisible ? true : false;
    _debugX(LiveMetricsView.getClassName(), `ngOnInit`, {
      this_state: this.state,
      query: QUERY,
    });
    this.queryService.refreshState(this.state.queryType);
    this.addFilterEventHandler();
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  addFilterEventHandler() {
    this.eventsService.filterEmitter.pipe(
      tap(() => this.eventsService.loadingEmit(true)),
      switchMap((query: any) => {
        this._cancelMetricsRequests$.next();
        _debugX(LiveMetricsView.getClassName(), `addFilterEventHandler`, { query });
        const QUERY = {};
        return forkJoin({
          configuration: this.liveAnalyticsConfigurationsService.findManyByQuery(QUERY).pipe(
            catchError((error: any) => this.handleFindLiveMetricsConfigurationError(error))
          ),
          query: of(query),
          date: of(Date.now())
        });
      }),
      takeUntil(this._destroyed$)
    ).subscribe((response: any) => {
      this.state.configuration = response?.configuration?.items[0]?.configuration;
      this.state.query = response?.query;

      _debugX(LiveMetricsView.getClassName(), 'addFilterEventHandler', {
        this_state: this.state,
        response: response,
      });

      this.eventsService.loadingEmit(false);
    });
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
    this._cancelMetricsRequests$.complete();
  }

  findDefaultConfiguration(configurations) {
    let retVal = false;
    if (
      lodash.isArray(configurations) &&
      !lodash.isEmpty(configurations)
    ) {
      configurations.map(configuration => {
        const DEFAULT_CONFIGURATION = configuration?.allowedMetrics?.isDefault;
        if (DEFAULT_CONFIGURATION) {
          this.state.configuration = configuration?.allowedMetrics;
          retVal = true;
        }
      })
    }
    return retVal;
  }

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

  handleRefreshClick() {
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

  handleAssistantSelectionEvent(event) {
    _debugX(LiveMetricsView.getClassName(), 'handleAssistantSelectionEvent', {
      event: event,
      this_state: this.state
    });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.ASSISTANT_IDS, this._selectedAssistantsIds());
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleDateRangeChange(range: any) {
    _debugX(LiveMetricsView.getClassName(), `handleDateRangeChange`, { range });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.DATE_RANGE, range);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  handleSystemMessagesVisibility(event: any) {
    _debugX(LiveMetricsView.getClassName(), 'handleSystemMessagesVisibility', { event });
    this.queryService.setFilterItem(this.state.queryType, QueryServiceV1.FILTER_KEY.IS_SYSTEM_MESSAGES_VISIBLE, event);
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

  isFeatureEnabled(featureName: string) {
    const LIVE_METRICS_ALLOWED_FEATURES = this.state.configuration;
    if (!lodash.isEmpty(LIVE_METRICS_ALLOWED_FEATURES)) {
      return ramda.pathOr(false, ['features', featureName], LIVE_METRICS_ALLOWED_FEATURES);
    }
  }

  private handleFindLiveMetricsConfigurationError(error: any): Observable<any> {
    _errorX(LiveMetricsView.getClassName(), 'handleFindLiveMetricsConfigurationError', { error });
    this.notificationService.showNotification(ANALYTICS_LIVE_MESSAGES.ERROR.FIND_METRICS);
    return of()
  }

  static route() {
    const RET_VAL = {
      path: 'live-metrics-view',
      component: LiveMetricsView,
      data: {
        name: 'live_metrics_view.name',
        breadcrumb: 'live_metrics_view.breadcrumb',
        component: LiveMetricsView.getClassName(),
        description: 'live_metrics_view.description',
      }
    };
    return RET_VAL;
  }
}
