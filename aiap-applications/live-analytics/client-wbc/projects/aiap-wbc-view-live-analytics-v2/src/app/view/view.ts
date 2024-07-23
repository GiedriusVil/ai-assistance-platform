/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

import lodash from 'lodash';

import {
  ConfigsService,
  QueryServiceV1,
  EventsServiceV1,
  DashboardsConfigurationsService,
} from 'client-services';

import { NotificationServiceV2, TranslateHelperServiceV1 } from 'client-shared-services';

import {
  DEFAULT_TABLE,
  ANALYTICS_LIVE_MESSAGES
} from 'client-utils';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';


import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'aiap-live-analytics-view-v2',
  templateUrl: './view.html',
  styleUrls: ['./view.scss'],
})
export class LiveAnalyticsViewV2 implements OnInit, OnDestroy {

  static getClassName() {
    return 'LiveAnalyticsViewV2';
  }

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.state.ready.configsWbc = true;
    //
    this.retrieveDashboard();
  }

  assetsUrl: any;

  _state = {
    configuration: undefined,
    query: undefined,
    queryType: DEFAULT_TABLE.LIVE_ANALYTICS.TYPE,
    dateRange: {},
    assistants: [],
    assistantsSelected: [],
    ready: {
      configsWbc: false,
      configsDashboard: false,
    },
  };

  state = lodash.cloneDeep(this._state);

  public _destroyed$: Subject<void> = new Subject();

  constructor(
    private configsService: ConfigsService,
    private queryService: QueryServiceV1,
    private eventsService: EventsServiceV1,
    private dashboardsConfigurationService: DashboardsConfigurationsService,
    private notificationService: NotificationServiceV2,
    protected translateHelperServiceV1: TranslateHelperServiceV1,
  ) { }

  async ngOnInit() {
    //
  }

  async ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  retrieveDashboard() {
    if (
      this.state.ready.configsWbc
    ) {
      const DEFAULT_QUERY = this.queryService.query(this.state.queryType);
      this.dashboardsConfigurationService.findManyByQuery(DEFAULT_QUERY).pipe(
        catchError((error: any) => this.handleFindLiveMetricsConfigurationError(error))
      ).subscribe((response: any) => {
        this.state.configuration = this.getDashboardConfiguration(response?.items)
        const DASHBOARD_QUERY_TYPE = this.state?.configuration?.ref;
        this.queryService.refreshState(DASHBOARD_QUERY_TYPE);
        this.state.ready.configsDashboard = true;
        _debugW(LiveAnalyticsViewV2.getClassName(), 'retrieveDashboard',
          {
            this_state: this.state,
            response: response,
          });
      });
    }
  }

  private getDashboardConfiguration(configurations: any) {
    const DASHBOARD_REF = this.configsService.getDashboardRef();
    const RET_VAL = configurations?.find(configuration => configuration.ref === DASHBOARD_REF) ?? configurations?.[0];
    return RET_VAL;
  }

  private handleFindLiveMetricsConfigurationError(error: any): Observable<any> {
    _errorW(LiveAnalyticsViewV2.getClassName(), 'handleFindLiveMetricsConfigurationError',
      {
        error,
      });
    this.notificationService.showNotification(ANALYTICS_LIVE_MESSAGES.ERROR.FIND_METRICS);
    return of()
  }


  handleRefreshClick() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }

}
