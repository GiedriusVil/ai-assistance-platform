/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import * as lodash from 'lodash';

import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import {
  _debugW,
  _errorW,
} from 'client-shared-utils';

import {
  DEFAULT_TABLE,
  ANALYTICS_LIVE_MESSAGES
} from 'client-utils';

import {
  ConfigsService,
  QueryServiceV1,
  EventsServiceV1,
  DashboardsConfigurationsService,
  HTMLDependenciesServiceV1
} from 'client-services';

import { NotificationServiceV2, TranslateHelperServiceV1 } from 'client-shared-services';

const HTML_TAG = 'aiap-wbc-view-live-analytics-v1';

@Component({
  selector: HTML_TAG,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AiapWbcViewLiveAnalyticsV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AiapWbcViewLiveAnalyticsV1';
  }

  static getElementTag() {
    return HTML_TAG;
  }

  @Input() set configs(configs: any) {
    this.configsService.parseConfigs(configs);
    this.state.ready.configsWbc = true;
    //
    this.loadHTMLDependencies();
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
    private htmlDependenciesService: HTMLDependenciesServiceV1,
    protected translateHelperServiceV1: TranslateHelperServiceV1,
    protected translateService: TranslateService,
  ) { }

  async ngOnInit() {
    //
  }

  async ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    try {
      const host = changes?.configs?.currentValue?.host;
      _debugW(AiapWbcViewLiveAnalyticsV1.getClassName(), 'ngOnChanges',
        {
          changes,
        });
      if (
        !lodash.isEmpty(host)
      ) {
        await this.initTranslations({
          app: 'aiap-wbc-view-live-analytics-v1',
          host: host,
          path: `/client-wbc/aiap-wbc-view-live-analytics-v1/assets/i18n`,
        });

      }
    } catch (error) {
      _errorW(AiapWbcViewLiveAnalyticsV1.getClassName(), 'ngOnChanges', { changes });
      throw error;
    }
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
        _debugW(AiapWbcViewLiveAnalyticsV1.getClassName(), 'retrieveDashboard',
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
    _errorW(AiapWbcViewLiveAnalyticsV1.getClassName(), 'handleFindLiveMetricsConfigurationError',
      {
        error,
      });
    this.notificationService.showNotification(ANALYTICS_LIVE_MESSAGES.ERROR.FIND_METRICS);
    return of()
  }


  handleRefreshClick() {
    this.eventsService.filterEmit(this.queryService.query(this.state.queryType));
  }


  protected isReady() {
    const STATE_READY: boolean = Object.values(this.state.ready).every(val => val === true);
    const CSS_LOADED: boolean = this.htmlDependenciesService.idLoadedCSSDependency(this.elCSSLinkId());
    const RET_VAL: boolean = STATE_READY && CSS_LOADED;
    return RET_VAL;
  }

  protected elCSSLinkId() {
    return AiapWbcViewLiveAnalyticsV1.getElementTag();
  }

  protected async initTranslations(
    configuration: {
      app: string,
      host: string,
      path: string,
    }
  ) {
    try {
      await this.translateHelperServiceV1.load(configuration);
      await this.translateHelperServiceV1.setTranslateService(this.translateService as any);
    } catch (error) {
      _errorW(AiapWbcViewLiveAnalyticsV1.getClassName(), '__initTranslations',
        {
          error,
        });
      throw error;
    }
  }

  private async loadHTMLDependencies() {
    if (this.state.ready.configsWbc) {
      const CLIENT_WBC_URL = `${this.configsService.getHost()}/client-wbc`;
      this.htmlDependenciesService.loadCSSDependency(this.elCSSLinkId(), `${CLIENT_WBC_URL}/${this.elCSSLinkId()}/styles.css`);
    }
  }

}
